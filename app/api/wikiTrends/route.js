const createThrottle = require("async-throttle");
const axios = require("axios");

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
const fetchPreviousRankMap = async ({currentDate, lang, slugs, maxDaysBack = 7}) => {
  // Parse the current date to get a Date object
  const [year, month, day] = currentDate.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed in Date

  // Try each previous day up to maxDaysBack
  for (let daysBack = 1; daysBack <= maxDaysBack; daysBack++) {
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - daysBack);

    const prevYear = prevDate.getFullYear();
    const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
    const prevDay = String(prevDate.getDate()).padStart(2, '0');
    const prevDateStr = `${prevYear}-${prevMonth}-${prevDay}`;

    const rankMap = await fetchRankMap({
      date: prevDateStr,
      lang,
      slugs,
    });

    // If we found data, return it
    if (Object.keys(rankMap).length > 0) {
      console.log(`Found previous rank data from ${prevDateStr} (${daysBack} days back)`);
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

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const searchParamLang = searchParams.get("lang");
  const searchParamOccupation = searchParams.get("occupation");
  const searchParamLimit = searchParams.get("limit");
  const lang =
    [
      "ar",
      "zh",
      "nl",
      "en",
      "fr",
      "de",
      "hu",
      "it",
      "ja",
      "pl",
      "pt",
      "ru",
      "es",
    ].indexOf(searchParamLang) !== -1
      ? searchParamLang
      : "en";
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

  // Yesterday in ET
  const {year, month, day} = getEasternDateComponents(1);

  const occupationCut = occupation ? `&occupation=eq.${occupation}` : "";
  const trendApiUrl = `${process.env.BASE_API}/trend?date=eq.${year}-${month}-${day}&lang=eq.${lang}&slug=neq.cleopatra${occupationCut}&order=rank_pantheon.asc&limit=${limit}`;

  const todaysBiosFromDbResp = await axios
    .get(trendApiUrl)
    .catch(e => (console.log("Pantheon trends read Error:", e), {data: []}));

  const todaysBiosFromDb = todaysBiosFromDbResp.data;

  if (todaysBiosFromDb.length) {
    const prevRankMap = await fetchPreviousRankMap({
      currentDate: `${year}-${month}-${day}`,
      lang,
      slugs: todaysBiosFromDb.map(d => d.slug),
    });
    const todaysBiosWithDeltas = addRankDeltas(todaysBiosFromDb, prevRankMap);
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
      const {year: year2DaysAgo, month: month2DaysAgo, day: day2DaysAgo} = getEasternDateComponents(2);
      const todaysBiosFromDbResp2 = await axios
        .get(
          `${process.env.BASE_API}/trend?date=eq.${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo}&slug=neq.cleopatra&lang=eq.${lang}${occupationCut}`
        )
        .catch(
          e => (console.log("Pantheon trends read Error:", e), {data: []})
        );
      return Response.json(
        [...todaysBiosFromDbResp2.data]
          .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
          .filter(dedupe)
          .slice(0, limit)
      );
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

    const prevRankMap = await fetchPreviousRankMap({
      currentDate: `${year}-${month}-${day}`,
      lang,
      slugs: todaysBiosForDb.map(d => d.slug),
    });
    const todaysBiosWithDeltas = addRankDeltas(todaysBiosForDb, prevRankMap);

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
