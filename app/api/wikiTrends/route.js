const createThrottle = require("async-throttle");
const axios = require("axios");
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
const {generateTrendingReason} = require("../../../libs/trendingReasons.js");

const dedupe = (item, index, self) =>
  self.findIndex(obj => obj.slug === item.slug) === index;

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const buildSlugOrFilter = slugs =>
  slugs.map(slug => `slug.eq."${encodeURIComponent(slug)}"`).join(",");

const fetchRankMap = async ({date, lang, slugs}) => {
  if (!slugs.length) return {};
  const slugChunks = chunk(slugs, 45);
  const rankResp = await Promise.all(
    slugChunks.map(slugChunk =>
      axios
        .get(
          `${
            process.env.BASE_API
          }/trend?date=eq.${date}&lang=eq.${lang}&select=slug,rank_pantheon&or=(${buildSlugOrFilter(
            slugChunk
          )})`
        )
        .catch(
          e => (console.log("Pantheon trends rank read Error:", e), {data: []})
        )
    )
  );
  return rankResp
    .flatMap(resp => resp.data)
    .reduce((obj, item) => {
      obj[item.slug] = item.rank_pantheon;
      return obj;
    }, {});
};

// Helper: Try to fetch rank data from previous days until we find some
const fetchPreviousRankMap = async ({
  currentDate,
  lang,
  slugs,
  maxDaysBack = 7,
}) => {
  // Parse the current date to get a Date object
  const [year, month, day] = currentDate.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed in Date

  // Try each previous day up to maxDaysBack
  for (let daysBack = 1; daysBack <= maxDaysBack; daysBack++) {
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - daysBack);

    const prevYear = prevDate.getFullYear();
    const prevMonth = String(prevDate.getMonth() + 1).padStart(2, "0");
    const prevDay = String(prevDate.getDate()).padStart(2, "0");
    const prevDateStr = `${prevYear}-${prevMonth}-${prevDay}`;

    const rankMap = await fetchRankMap({
      date: prevDateStr,
      lang,
      slugs,
    });

    // If we found data, return it
    if (Object.keys(rankMap).length > 0) {
      console.log(
        `Found previous rank data from ${prevDateStr} (${daysBack} days back)`
      );
      return rankMap;
    }
  }

  // No data found in the last maxDaysBack days
  console.log(`No previous rank data found in the last ${maxDaysBack} days`);
  return {};
};

const addRankDeltas = (arrOfBios, prevRankMap) =>
  arrOfBios.map(d => ({
    ...d,
    rank_delta:
      prevRankMap[d.slug] !== undefined
        ? prevRankMap[d.slug] - d.rank_pantheon
        : null,
  }));

const stripReasonFields = (arrOfBios) =>
  arrOfBios.map(d => {
    const {trending_reason, llm_provider, llm_metadata, trending_reason_generated_at, ...rest} = d;
    return rest;
  });

// Helper: get a YYYY, MM, DD for a given number of days ago in Eastern Time
function getEasternDateComponents(daysAgo = 0) {
  const now = new Date();

  // Convert "now" to Eastern Time
  const easternNow = new Date(
    now.toLocaleString("en-US", {timeZone: "America/New_York"})
  );

  // Go back N days
  easternNow.setDate(easternNow.getDate() - daysAgo);

  const year = easternNow.getFullYear();
  const month = String(easternNow.getMonth() + 1).padStart(2, "0");
  const day = String(easternNow.getDate()).padStart(2, "0");

  return {year, month, day};
}

// Helper: Process bios and generate missing trending reasons
async function processMissingTrendingReasons(bios, lang, date, force = false) {
  const biosNeedingReasons = force
    ? bios
    : bios.filter(bio => !bio.trending_reason);

  if (biosNeedingReasons.length === 0) {
    return bios;
  }

  console.log(
    `${force ? "Force regenerating" : "Generating"} trending reasons for ${
      biosNeedingReasons.length
    } people...`
  );

  // Generate reasons with throttling to avoid rate limits
  const throttle = createThrottle(5); // 5 concurrent requests max
  const reasonsPromises = biosNeedingReasons.map(bio =>
    throttle(async () => {
      const result = await generateTrendingReason(bio, lang);
      if (result) {
        return {
          slug: bio.slug,
          date,
          lang,
          trending_reason: result.story,
          llm_provider: "perplexity",
          llm_metadata: {
            model: "sonar",
            temperature: 0.2,
            citations: result.citations,
            usage: result.usage,
          },
          trending_reason_generated_at: new Date().toISOString(),
        };
      }
      return null;
    })
  );

  const generatedReasons = await Promise.all(reasonsPromises);
  const validReasons = generatedReasons.filter(r => r !== null);

  // Update database with new trending reasons using upsert
  if (validReasons.length > 0) {
    try {
      await axios.post(
        `${process.env.BASE_API}/trend?on_conflict=slug,date,lang`,
        validReasons.map(r => ({
          slug: r.slug,
          date: r.date,
          lang: r.lang,
          trending_reason: r.trending_reason,
          llm_provider: r.llm_provider,
          llm_metadata: r.llm_metadata,
          trending_reason_generated_at: r.trending_reason_generated_at,
        })),
        {
          headers: {
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=representation",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
          },
        }
      );
      console.log(
        `Upserted ${validReasons.length} trending reasons in database`
      );
    } catch (error) {
      console.error("Error upserting trending reasons:", error.message);
      if (error.response) {
        console.error(`  Status: ${error.response.status}`);
        console.error(
          `  Response:`,
          JSON.stringify(error.response.data, null, 2)
        );
      }
    }

    // Merge the generated reasons back into the bios array
    const reasonsMap = validReasons.reduce((acc, reason) => {
      acc[reason.slug] = reason;
      return acc;
    }, {});

    return bios.map(bio => {
      if (reasonsMap[bio.slug]) {
        return {
          ...bio,
          trending_reason: reasonsMap[bio.slug].trending_reason,
          llm_provider: reasonsMap[bio.slug].llm_provider,
          llm_metadata: reasonsMap[bio.slug].llm_metadata,
          trending_reason_generated_at:
            reasonsMap[bio.slug].trending_reason_generated_at,
        };
      }
      return bio;
    });
  }

  return bios;
}

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const searchParamLang = searchParams.get("lang");
  const searchParamOccupation = searchParams.get("occupation");
  const searchParamLimit = searchParams.get("limit");
  const searchParamDate = searchParams.get("date");
  const includeReason = searchParams.get("reason") === "true";
  const forceRegenerate = searchParams.get("force") === "true";
  const lang =
    SUPPORTED_LOCALES.indexOf(searchParamLang) !== -1
      ? searchParamLang
      : DEFAULT_LOCALE;
  const occupation =
    [
      "SOCCER PLAYER",
      "POLITICIAN",
      "ACTOR",
      "WRITER",
      "SINGER",
      "ATHLETE",
      "MUSICIAN",
      "SNOOKER",
    ].indexOf(searchParamOccupation) !== -1
      ? searchParamOccupation
      : null;
  const limit = parseInt(searchParamLimit, 10) || 100;

  // Use provided date or default to yesterday in ET
  let year, month, day;
  if (searchParamDate) {
    // Parse the provided date (format: YYYY-MM-DD)
    const dateObj = new Date(searchParamDate + "T12:00:00Z");
    year = dateObj.getFullYear();
    month = String(dateObj.getMonth() + 1).padStart(2, "0");
    day = String(dateObj.getDate()).padStart(2, "0");
  } else {
    // Default to yesterday in ET
    ({year, month, day} = getEasternDateComponents(1));
  }

  const occupationCut = occupation ? `&occupation=eq.${occupation}` : "";
  const reasonFields = includeReason
    ? ",trending_reason,llm_provider,llm_metadata,trending_reason_generated_at"
    : "";
  const trendApiUrl = `${process.env.BASE_API}/trend?date=eq.${year}-${month}-${day}&lang=eq.${lang}&slug=neq.cleopatra${occupationCut}&select=*${reasonFields}&order=rank_pantheon.asc&limit=${limit}`;

  const todaysBiosFromDbResp = await axios
    .get(trendApiUrl)
    .catch(e => (console.log("Pantheon trends read Error:", e), {data: []}));

  let todaysBiosFromDb = todaysBiosFromDbResp.data;

  if (todaysBiosFromDb.length) {
    // Generate missing trending reasons (or force regenerate if flag is set)
    if (includeReason) {
      todaysBiosFromDb = await processMissingTrendingReasons(
        todaysBiosFromDb,
        lang,
        `${year}-${month}-${day}`,
        forceRegenerate
      );
    }

    const prevRankMap = await fetchPreviousRankMap({
      currentDate: `${year}-${month}-${day}`,
      lang,
      slugs: todaysBiosFromDb.map(d => d.slug),
    });
    let todaysBiosWithDeltas = addRankDeltas(todaysBiosFromDb, prevRankMap);

    // Strip reason fields if not requested
    if (!includeReason) {
      todaysBiosWithDeltas = stripReasonFields(todaysBiosWithDeltas);
    }

    // console.log(`\n~~FOUND IN DB! (lang:${lang}|occupation:${occupation})~~\n`);
    return Response.json(
      [...todaysBiosWithDeltas]
        .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
        .filter(dedupe)
        .slice(0, limit)
    );
  } else {
    // console.log("\n***NOT FOUND IN DB!****\n");
    if (occupation) {
      const todaysBiosFromDbCheck = await axios
        .get(
          `${process.env.BASE_API}/trend?date=eq.${year}-${month}-${day}&slug=neq.cleopatra&lang=eq.${lang}&limit=1`
        )
        .catch(
          e => (console.log("Pantheon trends read Error:", e), {data: []})
        );
      if (todaysBiosFromDbCheck.data.length) {
        return Response.json([]);
      }
    }
    const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;
    const topPageViewsResp = await axios
      .get(wikiPageViewsURL, {
        headers: {
          "User-Agent":
            "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
      })
      .catch(e => {
        if (e.response) {
          return {data: [], error: e.response.data};
        }
        return {data: []};
      });
    const topPageViewsJson = topPageViewsResp.data;
    if (
      topPageViewsResp.error &&
      topPageViewsResp.error.detail &&
      topPageViewsResp.error.detail.includes(
        "The date(s) you used are valid, but we either do not have data for those date(s)"
      )
    ) {
      // Wikipedia doesn't have data for yesterday, try previous days
      const {
        year: year2DaysAgo,
        month: month2DaysAgo,
        day: day2DaysAgo,
      } = getEasternDateComponents(2);
      const todaysBiosFromDbResp2 = await axios
        .get(
          `${process.env.BASE_API}/trend?date=eq.${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo}&slug=neq.cleopatra&lang=eq.${lang}${occupationCut}`
        )
        .catch(
          e => (console.log("Pantheon trends read Error:", e), {data: []})
        );
      let fallbackData = [...todaysBiosFromDbResp2.data]
        .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
        .filter(dedupe)
        .slice(0, limit);

      // Strip reason fields if not requested
      if (!includeReason) {
        fallbackData = stripReasonFields(fallbackData);
      }

      return Response.json(fallbackData);
    }
    // create API URLs from list of people
    if (!topPageViewsJson.items || !Array.isArray(topPageViewsJson.items)) {
      return Response.json([]);
    }
    const trendingArticles = topPageViewsJson.items[0].articles.filter(
      article => article.article !== "Cleopatra"
    );
    const trendingArticlesLookup = {};
    const chunks = trendingArticles.length / 45;
    const trendingPeoplePantheonUrls = [];
    for (let i = 0; i < chunks; i++) {
      const currentArticlesChunk = trendingArticles.slice(i * 45, (i + 1) * 45);
      const trendingArticlesQuery = [];

      // validate URLs for non-english slugs
      if (lang !== "en") {
        const wikiLangTitles = currentArticlesChunk
          .map(p => encodeURIComponent(p.article))
          .join("|");
        const wikiLangLinksResp = await axios
          .get(
            `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${wikiLangTitles}&prop=langlinks&lllimit=500&llprop=url&lllang=en&format=json`,
            {
              headers: {
                "User-Agent":
                  "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
              },
            }
          )
          .catch(e => (console.log("Wiki Langlinks Error:", e), {data: []}));
        const wikiLangLinksJson = wikiLangLinksResp.data;

        currentArticlesChunk.forEach(article => {
          // see if name is normalized
          let normalizedArticleTitle = article.article;
          if (wikiLangLinksJson.query.normalized) {
            const normForm = wikiLangLinksJson.query.normalized.find(
              norm => norm.from === article.article
            );
            normalizedArticleTitle = normForm ? normForm.to : article.article;
          }
          const enArticle = Object.values(wikiLangLinksJson.query.pages).find(
            page => page.title === normalizedArticleTitle
          );
          if (
            enArticle &&
            enArticle.langlinks &&
            enArticle.langlinks.length &&
            enArticle.langlinks[0]["*"]
          ) {
            const enSlug = enArticle.langlinks[0].url.replace(
              "https://en.wikipedia.org/wiki/",
              ""
            );
            const enSlugQuoted = `"${enSlug}"`;
            trendingArticlesQuery.push(
              `slug.eq.${encodeURIComponent(enSlugQuoted)}`
            );
            trendingArticlesLookup[enSlug] = {
              ...article,
              title: enArticle.title,
            };
          }
        });
      } else {
        currentArticlesChunk.forEach(article => {
          trendingArticlesQuery.push(
            `slug.eq."${encodeURIComponent(article.article)}"`
          );
          trendingArticlesLookup[article.article] = {
            ...article,
            title: article.article,
          };
        });
        // trendingArticlesQuery = currentArticlesChunk.map(p => `slug.eq.${encodeURIComponent(p.article)}`);
      }

      trendingPeoplePantheonUrls.push(
        `${process.env.BASE_API}/person?or=(${trendingArticlesQuery})&select=id,birthyear,name,slug,occupation`
      );
    }

    // throttle API queries to 20 at a time
    const throttle = createThrottle(20);
    const bios = await Promise.all(
      trendingPeoplePantheonUrls.map(url =>
        throttle(async () => {
          const res = await axios
            .get(url)
            .catch(
              e => (
                console.log("Batch pantheon person query error:", e), {data: []}
              )
            );
          return res.data;
        })
      )
    );

    // filter out people not on pantheon and sort by num languages
    const biosOnPantheon = bios.filter(Array.isArray);

    // convert to format for db
    const todaysBiosForDbUnsorted = biosOnPantheon.flat().map(d => {
      // const trendDataFromWiki = trending.find(p => p.article === d.slug);
      const trendDataFromWiki = trendingArticlesLookup[d.slug];
      const retD = {
        ...d,
        ...trendDataFromWiki,
        lang,
        pid: d.id,
        date: `${year}-${month}-${day}`,
      };
      delete retD.id;
      delete retD.article;
      return retD;
    });
    // sort and add ranking
    const todaysBiosForDb = todaysBiosForDbUnsorted
      .sort((a, b) => a.rank - b.rank)
      .map((d, i) => ({...d, rank_pantheon: i + 1}));

    try {
      await axios.post(`${process.env.BASE_API}/trend`, todaysBiosForDb, {
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
        },
      });
    } catch (error) {
      // Ignore 409 Conflict errors, but log other errors
      if (!error.response || error.response.status !== 409) {
        console.error("Error posting to Pantheon trends:", error.message);
      }
    }

    // Generate missing trending reasons for newly added bios (or force regenerate if flag is set)
    let todaysBiosWithReasons = todaysBiosForDb;
    if (includeReason) {
      todaysBiosWithReasons = await processMissingTrendingReasons(
        todaysBiosForDb,
        lang,
        `${year}-${month}-${day}`,
        forceRegenerate
      );
    }

    const prevRankMap = await fetchPreviousRankMap({
      currentDate: `${year}-${month}-${day}`,
      lang,
      slugs: todaysBiosWithReasons.map(d => d.slug),
    });
    let todaysBiosWithDeltas = addRankDeltas(
      todaysBiosWithReasons,
      prevRankMap
    );

    // Strip reason fields if not requested
    if (!includeReason) {
      todaysBiosWithDeltas = stripReasonFields(todaysBiosWithDeltas);
    }

    if (occupation) {
      return Response.json(
        todaysBiosWithDeltas
          .filter(dedupe)
          .filter(d => d.occupation === occupation)
          .slice(0, limit)
      );
    }

    return Response.json(todaysBiosWithDeltas.filter(dedupe).slice(0, limit));
  }
}
