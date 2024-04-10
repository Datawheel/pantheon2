const createThrottle = require("async-throttle");
const axios = require("axios");
// const nest = require("d3-collection").nest;
import {nest} from "d3-collection";
// const sum = require("d3-array").sum;
import {sum} from "d3-array";

export async function GET(request) {
  const {searchParams} = new URL(request.url);

  const wikiId = searchParams.get("pid");
  if (!wikiId) return Response.json([]);

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
    .catch(e => (console.log("Pantheon DB trends read Error:", e), {data: []}));
  // if empty it means this person is not trending
  if (!monthAgoTrendFromDbResp.data.length) {
    return Response.json([]);
  }

  // try to get daily pageview data from db
  const monthAgoPvFromDbResp = await axios
    .get(
      `https://api.pantheon.world/trend_pageviews?date=eq.${year}-${month}-${day}&pid=eq.${wikiId}`
    )
    .catch(e => (console.log("Pantheon DB trends read Error:", e), {data: []}));
  if (monthAgoPvFromDbResp.data.length) {
    const pastMonthPvFromDbResp = await axios
      .get(
        `https://api.pantheon.world/trend_pageviews?date=gte.${year1monthAgo}-${month1monthAgo}-${day1monthAgo}&pid=eq.${wikiId}`
      )
      .catch(
        e => (console.log("Pantheon DB trends read Error:", e), {data: []})
      );
    enrichedPageViewsFlat = pastMonthPvFromDbResp.data;
  } else {
    // Determine available language editions for this person
    const availableLangsApi = `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&pageids=${wikiId}&lllimit=500&llprop=langname|url&format=json&origin=*`;
    const availableLangsResp = await axios
      .get(availableLangsApi)
      .catch(
        e => (
          console.log("Wiki Trending Error:", e), {error: "Wiki ID not found"}
        )
      );
    if (availableLangsResp.error) {
      return Response.json([]);
    }

    const availableLangsJson = availableLangsResp.data;
    if (availableLangsJson.query && availableLangsJson.query.pages) {
      const personResult = availableLangsJson.query.pages[`${wikiId}`];
      // return Response.json(personResult);
      if (personResult) {
        const {langlinks} = personResult;
        if (!langlinks) {
          return Response.json([]);
        }
        langlinks.unshift({
          "*": personResult.title,
          lang: "en",
          langname: "English",
          url: `https://en.wikipedia.org/wiki/${personResult.title}`,
        });
        // const langlinksLookup = langlinks.reduce((obj, d) => (obj[d.lang] = d, obj), {});
        const langReqs = langlinks.map(
          ll =>
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${
              ll.lang
            }.wikipedia/all-access/all-agents/${encodeURIComponent(
              ll["*"]
            )}/daily/${monthAgo}/${yesterday}`
        );
        // return Response.json({langReqs, langlinks, monthAgo, yesterday});

        // throttle API queries to 20 at a time
        const throttle = createThrottle(20);
        const pageViews = await Promise.all(
          langReqs.map(url =>
            throttle(async () => {
              const res = await axios
                .get(url)
                .catch(() => ({data: {items: []}}));
              return res.data ? res.data.items : [];
            })
          )
        );

        // filter out empty results
        const pageViewsWithData = pageViews.filter(
          arr => Array.isArray(arr) && arr.length
        );

        const pageViewsFlat = [].concat.apply([], pageViewsWithData);

        enrichedPageViewsFlat = pageViewsFlat.map(pv => {
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
                "Authorization":
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
                "Prefer": "resolution=merge-duplicates",
              },
            }
          )
          .catch(err => (console.log(err), []));
      }
    }
  }

  const pvTotals = nest()
    .key(d => d.date)
    .entries(enrichedPageViewsFlat)
    .map(pvData => ({
      date: pvData.key,
      pid: `${pvData.values[0].pid}`,
      slug: pvData.values.find(d => d.lang === "en").slug,
      views: sum(pvData.values, d => d.views),
    }));
  // pvTotals
  return Response.json(pvTotals.sort((a, b) => a.date.localeCompare(b.date)));
}
