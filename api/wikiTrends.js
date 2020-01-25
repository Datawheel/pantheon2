const fetch = require("node-fetch");
const createThrottle = require("async-throttle");
const axios = require("axios");


module.exports = function(app) {

  app.get("/api/wikiTrends", async(req, res) => {
    const lang = req.query.lang || "en";
    const dateobj = new Date();
    const year = dateobj.getFullYear();
    const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    const day = `${dateobj.getDate() - 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");

    const todaysBiosFromDbResp = await fetch(`https://api.pantheon.world/trend?date=eq.${year}-${month}-${day}&lang=eq.${lang}`);
    const todaysBiosFromDb = await todaysBiosFromDbResp.json();

    if (todaysBiosFromDb.length) {
      return res.json(todaysBiosFromDb);
    }
    else {
      const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;

      const topPageViewsResp = await fetch(wikiPageViewsURL);
      const topPageViewsJson = await topPageViewsResp.json();

      // create API URLs from list of people
      if (!topPageViewsJson.items || !Array.isArray(topPageViewsJson.items)) {
        return res.json([]);
      }
      const trendingPeople = topPageViewsJson.items[0].articles;
      const chunks = trendingPeople.length / 50;
      const trendingPeoplePantheonUrls = [];
      for (let i = 0; i < chunks; i++) {
        const trendingPeopleQuery = trendingPeople.slice(i * 50, (i + 1) * 50).map(p => `slug.eq.${encodeURIComponent(p.article)}`);
        trendingPeoplePantheonUrls.push(`https://api.pantheon.world/person?or=(${trendingPeopleQuery})&select=id,name,hpi,slug`);
      }

      // throttle API queries to 20 at a time
      const throttle = createThrottle(20);
      const bios = await Promise.all(trendingPeoplePantheonUrls.map(url => throttle(async() => {
        const res = await fetch(url);
        const data = await res.json();
        return data;
      })));

      // filter out people not on pantheon and sort by num languages
      const biosOnPantheon = bios
        .filter(Array.isArray);

      // convert to format for db
      const todaysBiosForDb = biosOnPantheon.flat().map(d => {
        const trendDataFromWiki = trendingPeople.find(p => p.article === d.slug);
        const retD = {...d, ...trendDataFromWiki, lang, pid: d.id, date: `${year}-${month}-${day}`};
        delete retD.id;
        delete retD.article;
        return retD;
      });

      todaysBiosForDb.forEach(async bio => {
      // const myDbWriteRequest = await fetch("https://api.pantheon.world/trend", {
      //   method: "POST",
      //   // headers: pgAuthHeaders,
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8"
      //   },
      //   // body: JSON.parse(JSON.stringify(bio))
      //   body: myEscapedJSONString
      // });
        await axios.post("https://api.pantheon.world/trend", bio, {headers: {"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8"}});
      });

      return res.json(todaysBiosForDb);
    }
  });

}
;
