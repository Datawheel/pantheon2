const createThrottle = require("async-throttle");
const axios = require("axios");
const nest = require("d3-collection").nest;
const sum = require("d3-array").sum;

const calcRankDeltas = (arrOfBios, day1Ago, day2Ago) => {
  const day2AgoRanks = arrOfBios
    .filter((d) => d.date === day2Ago)
    .reduce((obj, item) => {
      obj[item.slug] = item;
      return obj;
    }, {});
  return arrOfBios
    .filter((d) => d.date === day1Ago)
    .map((d) =>
      Object.assign({}, d, {
        rank_delta: day2AgoRanks[d.slug]
          ? day2AgoRanks[d.slug].rank_pantheon - d.rank_pantheon
          : null,
      })
    );
};

module.exports = function (app) {
  app.get("/api/wikiRelated", async (req, res) => {
    // wikipedia person ID
    const wikiSlug = req.query.slug;
    if (!wikiSlug) return res.json([]);

    const wikiRelatedURL = `https://en.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(
      wikiSlug
    )}`;
    const topRelatedResp = await axios
      .get(wikiRelatedURL)
      .catch(
        (e) => (
          console.log(`Wiki Related API Error: No page for ${wikiSlug} found.`),
          { data: [] }
        )
      );
    const topRelatedJson = topRelatedResp.data;

    if (!topRelatedJson.pages || !topRelatedJson.pages.length)
      return res.json([]);

    const pantheonPersonQuery = topRelatedJson.pages.map(
      (d) => `id.eq.${d.pageid}`
    );
    const topRelatedInPantheonResp = await axios
      .get(
        `https://api.pantheon.world/person?or=(${pantheonPersonQuery})&select=id,birthyear,name,hpi,slug,occupation.occupation_name`
      )
      .catch(
        (e) => (
          console.log(`Pantheon Related Error: No bios for ${wikiSlug} found.`),
          { data: [] }
        )
      );
    const enrichedPantheonBios = topRelatedInPantheonResp.data.map((d) => {
      const wikiData = topRelatedJson.pages.find(
        (p) => `${p.pageid}` === `${d.id}`
      );
      return wikiData
        ? { ...d, description: wikiData.description, extract: wikiData.extract }
        : d;
    });
    return res.json(enrichedPantheonBios);
  });

  app.get("/api/wikiTrendDetails", async (req, res) => {
    // wikipedia person ID
    const wikiId = parseInt(req.query.pid, 10);
    if (!wikiId) return res.json([]);

    const dateobj = new Date();
    // set date to yesterday
    dateobj.setDate(dateobj.getDate() - 1);
    const year = dateobj.getFullYear();
    const month = `${dateobj.getMonth() + 1}`.replace(
      /(^|\D)(\d)(?!\d)/g,
      "$10$2"
    );
    const day = `${dateobj.getDate()}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    const yesterday = `${year}${month}${day}`;
    dateobj.setDate(dateobj.getDate() - 29);
    const year1monthAgo = dateobj.getFullYear();
    const month1monthAgo = `${dateobj.getMonth() + 1}`.replace(
      /(^|\D)(\d)(?!\d)/g,
      "$10$2"
    );
    const day1monthAgo = `${dateobj.getDate()}`.replace(
      /(^|\D)(\d)(?!\d)/g,
      "$10$2"
    );
    const monthAgo = `${year1monthAgo}${month1monthAgo}${day1monthAgo}`;

    let enrichedPageViewsFlat = [];

    // FIRST check if this person is trending at all
    const monthAgoTrendFromDbResp = await axios
      .get(
        `https://api.pantheon.world/trend?date=gte.${year1monthAgo}-${month1monthAgo}-${day1monthAgo}&pid=eq.${wikiId}&rank_pantheon=lte.100`
      )
      .catch(
        (e) => (console.log("Pantheon DB trends read Error:", e), { data: [] })
      );
    // if empty it means this person is not trending
    if (!monthAgoTrendFromDbResp.data.length) {
      return res.json([]);
    }

    // try to get daily pageview data from db
    const monthAgoPvFromDbResp = await axios
      .get(
        `https://api.pantheon.world/trend_pageviews?date=eq.${year}-${month}-${day}&pid=eq.${wikiId}`
      )
      .catch(
        (e) => (console.log("Pantheon DB trends read Error:", e), { data: [] })
      );
    if (monthAgoPvFromDbResp.data.length) {
      const pastMonthPvFromDbResp = await axios
        .get(
          `https://api.pantheon.world/trend_pageviews?date=gte.${year1monthAgo}-${month1monthAgo}-${day1monthAgo}&pid=eq.${wikiId}`
        )
        .catch(
          (e) => (
            console.log("Pantheon DB trends read Error:", e), { data: [] }
          )
        );
      enrichedPageViewsFlat = pastMonthPvFromDbResp.data;
    } else {
      // Determine available language editions for this person
      const availableLangsApi = `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&pageids=${wikiId}&lllimit=500&llprop=langname|url&format=json&origin=*`;
      const availableLangsResp = await axios
        .get(availableLangsApi)
        .catch(
          (e) => (
            console.log("Wiki Trending Error:", e),
            { error: "Wiki ID not found" }
          )
        );
      if (availableLangsResp.error) {
        return res.json([]);
      }

      const availableLangsJson = availableLangsResp.data;
      if (availableLangsJson.query && availableLangsJson.query.pages) {
        const personResult = availableLangsJson.query.pages[`${wikiId}`];
        // return res.json(personResult);
        if (personResult) {
          const { langlinks } = personResult;
          if (!langlinks) {
            return res.json([]);
          }
          langlinks.unshift({
            "*": personResult.title,
            lang: "en",
            langname: "English",
            url: `https://en.wikipedia.org/wiki/${personResult.title}`,
          });
          // const langlinksLookup = langlinks.reduce((obj, d) => (obj[d.lang] = d, obj), {});
          const langReqs = langlinks.map(
            (ll) =>
              `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${
                ll.lang
              }.wikipedia/all-access/all-agents/${encodeURIComponent(
                ll["*"]
              )}/daily/${monthAgo}/${yesterday}`
          );
          // return res.json({langReqs, langlinks, monthAgo, yesterday});

          // throttle API queries to 20 at a time
          const throttle = createThrottle(20);
          const pageViews = await Promise.all(
            langReqs.map((url) =>
              throttle(async () => {
                const res = await axios
                  .get(url)
                  .catch(() => ({ data: { items: [] } }));
                return res.data ? res.data.items : [];
              })
            )
          );

          // filter out empty results
          const pageViewsWithData = pageViews.filter(
            (arr) => Array.isArray(arr) && arr.length
          );

          const pageViewsFlat = [].concat.apply([], pageViewsWithData);

          enrichedPageViewsFlat = pageViewsFlat.map((pv) => {
            // sample date: 2020012500
            const formattedDate = `${pv.timestamp.slice(
              0,
              4
            )}-${pv.timestamp.slice(4, 6)}-${pv.timestamp.slice(6, 8)}`;
            return {
              pid: wikiId,
              date: formattedDate,
              slug: pv.article,
              views: pv.views,
              lang: pv.project.replace(".wikipedia", ""),
            };
          });

          // UPSERT via "Prefer: resolution=merge-duplicates" header
          await axios
            .post(
              "https://api.pantheon.world/trend_pageviews",
              enrichedPageViewsFlat,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
                  Prefer: "resolution=merge-duplicates",
                },
              }
            )
            .catch((err) => (console.log(err), []));
        }
      }
    }

    const pvTotals = nest()
      .key((d) => d.date)
      .entries(enrichedPageViewsFlat)
      .map((pvData) => ({
        date: pvData.key,
        pid: `${pvData.values[0].pid}`,
        slug: pvData.values.find((d) => d.lang === "en").slug,
        views: sum(pvData.values, (d) => d.views),
      }));
    // pvTotals
    return res.json(pvTotals.sort((a, b) => a.date.localeCompare(b.date)));
  });

  app.get("/api/wikiTrends", async (req, res) => {
    const lang =
      [
        "ar",
        "zh",
        "nl",
        "en",
        "fr",
        "de",
        "it",
        "ja",
        "pl",
        "pt",
        "ru",
        "es",
      ].indexOf(req.query.lang) !== -1
        ? req.query.lang
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
      ].indexOf(req.query.occupation) !== -1
        ? req.query.occupation
        : null;
    const limit = parseInt(req.query.limit, 10) || 100;
    const dateobj = new Date();
    // set date to yesterday
    dateobj.setDate(dateobj.getDate() - 1);
    const year = dateobj.getFullYear();
    const month = `${dateobj.getMonth() + 1}`.replace(
      /(^|\D)(\d)(?!\d)/g,
      "$10$2"
    );
    const day = `${dateobj.getDate()}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    dateobj.setDate(dateobj.getDate() - 1);
    const year2DaysAgo = dateobj.getFullYear();
    const month2DaysAgo = `${dateobj.getMonth() + 1}`.replace(
      /(^|\D)(\d)(?!\d)/g,
      "$10$2"
    );
    const day2DaysAgo = `${dateobj.getDate()}`.replace(
      /(^|\D)(\d)(?!\d)/g,
      "$10$2"
    );

    const occupationCut = occupation ? `&occupation=eq.${occupation}` : "";
    const todaysBiosFromDbResp = await axios
      .get(
        `https://api.pantheon.world/trend?or=(date.eq.${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo},date.eq.${year}-${month}-${day})&lang=eq.${lang}${occupationCut}`
      )
      .catch(
        (e) => (console.log("Pantheon trends read Error:", e), { data: [] })
      );
    // const todaysBiosFromDb = calcRankDeltas(
    //   todaysBiosFromDbResp.data,
    //   `${year}-${month}-${day}`,
    //   `${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo}`
    // );
    const todaysBiosFromDb = [];

    if (todaysBiosFromDb.length) {
      return res.json(
        [...todaysBiosFromDb]
          .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
          .slice(0, limit)
      );
    } else {
      if (occupation) {
        const todaysBiosFromDbCheck = await axios
          .get(
            `https://api.pantheon.world/trend?date=eq.${year}-${month}-${day}&lang=eq.${lang}&limit=1`
          )
          .catch(
            (e) => (console.log("Pantheon trends read Error:", e), { data: [] })
          );
        if (todaysBiosFromDbCheck.data.length) {
          return res.json([]);
        }
      }
      const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;
      const topPageViewsResp = await axios.get(wikiPageViewsURL).catch((e) => {
        if (e.response) {
          return { data: [], error: e.response.data };
        }
        return { data: [] };
      });
      const topPageViewsJson = topPageViewsResp.data;
      if (
        true ||
        (topPageViewsResp.error &&
          topPageViewsResp.error.detail.includes(
            "The date(s) you used are valid, but we either do not have data for those date(s)"
          ))
      ) {
        const todaysBiosFromDbResp2 = await axios
          .get(
            `https://api.pantheon.world/trend?date=eq.${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo})&lang=eq.${lang}${occupationCut}`
          )
          .catch(
            (e) => (console.log("Pantheon trends read Error:", e), { data: [] })
          );
        return res.json(
          [...todaysBiosFromDbResp2.data]
            .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
            .slice(0, limit)
        );
        return res.json({ topPageViewsResp });
      }
      // create API URLs from list of people
      if (!topPageViewsJson.items || !Array.isArray(topPageViewsJson.items)) {
        return res.json([]);
      }
      const trendingArticles = topPageViewsJson.items[0].articles;
      const trendingArticlesLookup = {};
      const chunks = trendingArticles.length / 50;
      const trendingPeoplePantheonUrls = [];
      for (let i = 0; i < chunks; i++) {
        const currentArticlesChunk = trendingArticles.slice(
          i * 50,
          (i + 1) * 50
        );
        const trendingArticlesQuery = [];

        // validate URLs for non-english slugs
        if (lang !== "en") {
          const wikiLangTitles = currentArticlesChunk
            .map((p) => encodeURIComponent(p.article))
            .join("|");
          const wikiLangLinksResp = await axios
            .get(
              `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${wikiLangTitles}&prop=langlinks&lllimit=500&llprop=url&lllang=en&format=json`
            )
            .catch(
              (e) => (console.log("Wiki Langlinks Error:", e), { data: [] })
            );
          const wikiLangLinksJson = wikiLangLinksResp.data;

          currentArticlesChunk.forEach((article) => {
            // see if name is normalized
            let normalizedArticleTitle = article.article;
            if (wikiLangLinksJson.query.normalized) {
              const normForm = wikiLangLinksJson.query.normalized.find(
                (norm) => norm.from === article.article
              );
              normalizedArticleTitle = normForm ? normForm.to : article.article;
            }
            const enArticle = Object.values(wikiLangLinksJson.query.pages).find(
              (page) => page.title === normalizedArticleTitle
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
          currentArticlesChunk.forEach((article) => {
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
          `https://api.pantheon.world/person?or=(${trendingArticlesQuery})&select=id,birthyear,name,hpi,slug,occupation`
        );
      }

      // throttle API queries to 20 at a time
      const throttle = createThrottle(20);
      const bios = await Promise.all(
        trendingPeoplePantheonUrls.map((url) =>
          throttle(async () => {
            const res = await axios
              .get(url)
              .catch(
                (e) => (
                  console.log("Batch pantheon person query error:", e),
                  { data: [] }
                )
              );
            return res.data;
          })
        )
      );

      // filter out people not on pantheon and sort by num languages
      const biosOnPantheon = bios.filter(Array.isArray);

      // convert to format for db
      const todaysBiosForDbUnsorted = biosOnPantheon.flat().map((d) => {
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
        .map((d, i) => ({ ...d, rank_pantheon: i + 1 }));

      await axios.post("https://api.pantheon.world/trend", todaysBiosForDb, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
        },
      });

      if (occupation) {
        return res.json(
          todaysBiosForDb
            .filter((d) => d.occupation === occupation)
            .slice(0, limit)
        );
      }

      return res.json(todaysBiosForDb.slice(0, limit));
    }
  });
};
