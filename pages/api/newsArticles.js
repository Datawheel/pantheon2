const axios = require("axios");
const newsApiKey = process.env.NEWS_API_KEY;

const pgFormatDate = dateobj => {
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  const day = `${dateobj.getDate()}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  return `${year}-${month}-${day}`;
};

module.exports = function(app) {

  app.get("/api/news", async(req, res) => {
    // wikipedia person ID
    const wikiId = parseInt(req.query.pid, 10);
    if (!wikiId) return res.json([]);
    // lang filter
    const lang = ["ar", "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"].indexOf(req.query.lang) !== -1 ? req.query.lang : "en";
    if (!lang) return res.json([]);
    // get date from 2 days ago
    const dateobj = new Date();
    const today = pgFormatDate(dateobj);
    dateobj.setDate(dateobj.getDate() - 2);
    const daysAgo2 = pgFormatDate(dateobj);

    // FIRST check if this person is trending in the past 2 days
    const trendFromDbResp = await axios.get(`https://api.pantheon.world/trend?date=gte.${daysAgo2}&pid=eq.${wikiId}&lang=eq.${lang}&rank_pantheon=lte.100`).catch(e => (console.log("Pantheon DB trends read Error:", e), {data: []}));
    // if empty it means this person is not trending
    // console.log("trendFromDbResp.data!", trendFromDbResp.data, `https://api.pantheon.world/trend?date=gte.${daysAgo2}&pid=eq.${wikiId}&lang=eq.${lang}&rank_pantheon=lte.100`);
    if (!trendFromDbResp.data.length) {
      return res.json([]);
    }

    const {slug, name} = trendFromDbResp.data[0];

    // NEXT check if it's already in the db...
    const todaysNewsFromDbResp = await axios.get(`https://api.pantheon.world/news?fetch_date=eq.${today}&pid=eq.${wikiId}`).catch(e => (console.log("Pantheon DB news read Error:", e), {data: []}));

    if (todaysNewsFromDbResp.data.length) {
      return res.json(todaysNewsFromDbResp.data);
    }

    const newApiUrl = `http://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(name)}&from=${daysAgo2}&sortBy=relevancy&pageSize=5&apiKey=${newsApiKey}&language=en&excludeDomains=youtube.com`;

    const newsResp = await axios.get(newApiUrl).catch(e => (console.log("newsapi.org Error:", name), {data: {articles: []}}));
    const newsResults = newsResp.data;

    // newsResults.articles.slice(0, 5).forEach(article => {
    //   console.log("len of desc:", article.description.length);
    // });
    const allArticles = newsResults.articles.slice(0, 4).map(article => ({
      name,
      pid: wikiId,
      slug,
      article: {
        source: article.source,
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt
      }
    }));

    const newsPosts = allArticles.map(newsItem => axios.post("https://api.pantheon.world/news?columns=name,pid,slug,article", newsItem, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
        "Prefer": "resolution=merge-duplicates"
      }
    }).catch(err => {
      console.log(`[News API] unable to post news item about ${name} to db.`);
      return {error: err};
    }));
    await Promise.all(newsPosts);

    return res.json(allArticles);

  });

};
