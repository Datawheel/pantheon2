const createThrottle = require("async-throttle");
const axios = require("axios");

module.exports = function(app) {

  app.get("/api/wikiTrends", async(req, res) => {
    const lang = ["ar", "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"].indexOf(req.query.lang) !== -1 ? req.query.lang : "en";
    const limit = parseInt(req.query.limit, 10) || 100;
    const dateobj = new Date();
    const year = dateobj.getFullYear();
    const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    const day = `${dateobj.getDate() - 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");

    const todaysBiosFromDbResp = await axios.get(`https://api.pantheon.world/trend?date=eq.${year}-${month}-${day}&lang=eq.${lang}`).catch(e => (console.log("Pantheon trends read Error:", e), {data: []}));
    const todaysBiosFromDb = todaysBiosFromDbResp.data;

    if (todaysBiosFromDb.length) {
      return res.json(todaysBiosFromDb.slice(0, limit));
    }
    else {
      const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;
      const topPageViewsResp = await axios.get(wikiPageViewsURL).catch(e => (console.log("Wiki Trending Error:", e), {data: []}));
      const topPageViewsJson = topPageViewsResp.data;

      // create API URLs from list of people
      if (!topPageViewsJson.items || !Array.isArray(topPageViewsJson.items)) {
        return res.json([]);
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
          const wikiLangTitles = currentArticlesChunk.map(p => encodeURIComponent(p.article)).join("|");
          const wikiLangLinksResp = await axios.get(`https://${lang}.wikipedia.org/w/api.php?action=query&titles=${wikiLangTitles}&prop=langlinks&lllimit=500&llprop=url&lllang=en&format=json`).catch(e => (console.log("Wiki Langlinks Error:", e), {data: []}));
          const wikiLangLinksJson = wikiLangLinksResp.data;

          currentArticlesChunk.forEach(article => {
            // see if name is normalized
            const normForm = wikiLangLinksJson.query.normalized.find(norm => norm.from === article.article);
            const normalizedArticleTitle = normForm ? normForm.to : article.article;
            const enArticle = Object.values(wikiLangLinksJson.query.pages).find(page => page.title === normalizedArticleTitle);
            if (enArticle && enArticle.langlinks && enArticle.langlinks.length && enArticle.langlinks[0]["*"]) {
              const enSlug = enArticle.langlinks[0].url.replace("https://en.wikipedia.org/wiki/", "");
              const enSlugQuoted = `"${enSlug}"`;
              trendingArticlesQuery.push(`slug.eq.${encodeURIComponent(enSlugQuoted)}`);
              trendingArticlesLookup[enSlug] = {...article, title: enArticle.title};
            }
          });
        }
        else {
          currentArticlesChunk.forEach(article => {
            trendingArticlesQuery.push(`slug.eq."${encodeURIComponent(article.article)}"`);
            trendingArticlesLookup[article.article] = {...article, title: article.article};
          });
          // trendingArticlesQuery = currentArticlesChunk.map(p => `slug.eq.${encodeURIComponent(p.article)}`);
        }

        trendingPeoplePantheonUrls.push(`https://api.pantheon.world/person?or=(${trendingArticlesQuery})&select=id,birthyear,name,hpi,slug`);
      }

      // throttle API queries to 20 at a time
      const throttle = createThrottle(20);
      const bios = await Promise.all(trendingPeoplePantheonUrls.map(url => throttle(async() => {
        const res = await axios.get(url).catch(e => (console.log("Batch pantheon person query error:", e), {data: []}));
        return res.data;
      })));

      // filter out people not on pantheon and sort by num languages
      const biosOnPantheon = bios
        .filter(Array.isArray);

      // convert to format for db
      const todaysBiosForDbUnsorted = biosOnPantheon.flat().map(d => {
        // const trendDataFromWiki = trending.find(p => p.article === d.slug);
        const trendDataFromWiki = trendingArticlesLookup[d.slug];
        const retD = {...d, ...trendDataFromWiki, lang, pid: d.id, date: `${year}-${month}-${day}`};
        delete retD.id;
        delete retD.article;
        return retD;
      });
      // sort and add ranking
      const todaysBiosForDb = todaysBiosForDbUnsorted.sort((a, b) => a.rank - b.rank).map((d, i) => ({...d, rank_pantheon: i + 1}));

      await axios.post("https://api.pantheon.world/trend", todaysBiosForDb, {
        headers: {"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8"}
      });

      return res.json(todaysBiosForDb.slice(0, limit));
    }
  });

}
;
