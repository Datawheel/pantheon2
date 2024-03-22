const createThrottle = require("async-throttle");
const axios = require("axios");

const calcRankDeltas = (arrOfBios, day1Ago, day2Ago) => {
  const day2AgoRanks = arrOfBios
    .filter(d => d.date === day2Ago)
    .reduce((obj, item) => {
      obj[item.slug] = item;
      return obj;
    }, {});
  return arrOfBios
    .filter(d => d.date === day1Ago)
    .map(d =>
      Object.assign({}, d, {
        rank_delta: day2AgoRanks[d.slug]
          ? day2AgoRanks[d.slug].rank_pantheon - d.rank_pantheon
          : null,
      })
    );
};

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
      `https://api-dev.pantheon.world/trend?or=(date.eq.${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo},date.eq.${year}-${month}-${day})&lang=eq.${lang}${occupationCut}`
    )
    .catch(e => (console.log("Pantheon trends read Error:", e), {data: []}));
  const todaysBiosFromDb = calcRankDeltas(
    todaysBiosFromDbResp.data,
    `${year}-${month}-${day}`,
    `${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo}`
  );

  if (todaysBiosFromDb.length) {
    return Response.json(
      [...todaysBiosFromDb]
        .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
        .slice(0, limit)
    );
  } else {
    if (occupation) {
      const todaysBiosFromDbCheck = await axios
        .get(
          `https://api-dev.pantheon.world/trend?date=eq.${year}-${month}-${day}&lang=eq.${lang}&limit=1`
        )
        .catch(
          e => (console.log("Pantheon trends read Error:", e), {data: []})
        );
      if (todaysBiosFromDbCheck.data.length) {
        return Response.json([]);
      }
    }
    const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;
    const topPageViewsResp = await axios.get(wikiPageViewsURL).catch(e => {
      if (e.response) {
        return {data: [], error: e.response.data};
      }
      return {data: []};
    });
    const topPageViewsJson = topPageViewsResp.data;
    if (
      topPageViewsResp.error &&
      topPageViewsResp.error.detail.includes(
        "The date(s) you used are valid, but we either do not have data for those date(s)"
      )
    ) {
      const todaysBiosFromDbResp2 = await axios
        .get(
          `https://api-dev.pantheon.world/trend?date=eq.${year2DaysAgo}-${month2DaysAgo}-${day2DaysAgo})&lang=eq.${lang}${occupationCut}`
        )
        .catch(
          e => (console.log("Pantheon trends read Error:", e), {data: []})
        );
      return Response.json(
        [...todaysBiosFromDbResp2.data]
          .sort((a, b) => a.rank_pantheon - b.rank_pantheon)
          .slice(0, limit)
      );
      // return Response.json({topPageViewsResp});
    }
    // create API URLs from list of people
    if (!topPageViewsJson.items || !Array.isArray(topPageViewsJson.items)) {
      return Response.json([]);
    }
    const trendingArticles = topPageViewsJson.items[0].articles;
    const trendingArticlesLookup = {};
    const chunks = trendingArticles.length / 50;
    const trendingPeoplePantheonUrls = [];
    for (let i = 0; i < chunks; i++) {
      const currentArticlesChunk = trendingArticles.slice(i * 50, (i + 1) * 50);
      const trendingArticlesQuery = [];

      // validate URLs for non-english slugs
      if (lang !== "en") {
        const wikiLangTitles = currentArticlesChunk
          .map(p => encodeURIComponent(p.article))
          .join("|");
        const wikiLangLinksResp = await axios
          .get(
            `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${wikiLangTitles}&prop=langlinks&lllimit=500&llprop=url&lllang=en&format=json`
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
        `https://api-dev.pantheon.world/person?or=(${trendingArticlesQuery})&select=id,birthyear,name,hpi,slug,occupation`
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

    await axios.post("https://api-dev.pantheon.world/trend", todaysBiosForDb, {
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
      },
    });

    if (occupation) {
      return Response.json(
        todaysBiosForDb.filter(d => d.occupation === occupation).slice(0, limit)
      );
    }

    return Response.json(todaysBiosForDb.slice(0, limit));
  }
}
