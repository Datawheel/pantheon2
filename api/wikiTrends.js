const fetch = require("node-fetch");
const createThrottle = require("async-throttle");

module.exports = function(app) {

  app.get("/api/wikiTrends", async(req, res) => {
    const lang = req.query.lang || "en";
    const dateobj = new Date();
    const year = dateobj.getFullYear();
    const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    const day = `${dateobj.getDate() - 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;

    const topPageViewsResp = await fetch(wikiPageViewsURL);
    const topPageViewsJson = await topPageViewsResp.json();

    // create API URLs from list of people
    const trendingPeople = topPageViewsJson.items[0].articles;
    const chunks = trendingPeople.length / 50;
    const trendingPeoplePantheonUrls = [];
    for (let i = 0; i < chunks; i++) {
      const trendingPeopleQuery = trendingPeople.slice(i * 50, (i + 1) * 50).map(p => `slug.eq.${encodeURIComponent(p.article)}`);
      trendingPeoplePantheonUrls.push(`https://api.pantheon.world/person?or=(${trendingPeopleQuery})&select=id,birthyear,name,l,gender,slug`);
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

    return res.json(biosOnPantheon.flat());
  });

}
;
