import langFamilies from "/data/langFamilies.json";
import PageViewsByLangSummary from "/components/person/PageViewsByLangSummary";
import PageViewsByLangAreaPlot from "/components/person/PageViewByLangAreaPlot";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";

function yyyymmdd(dateIn) {
  const mm = dateIn.getMonth() + 1; // getMonth() is zero-based
  const dd = dateIn.getDate();

  return [
    dateIn.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("");
}

async function getLangEditions(personId) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&pageids=${personId}&lllimit=500&llprop=langname|url&format=json&origin=*`
  );
  return res.json();
}

async function getTimeSeriesData(wikiData, person) {
  if (wikiData.query) {
    if (wikiData.query.pages) {
      const personResult = wikiData.query.pages[person.id];
      if (personResult) {
        const {langlinks} = personResult;
        langlinks.unshift({
          "*": person.name,
          "lang": "en",
          "langname": "English",
          "url": `https://en.wikipedia.org/wiki/${person.name}`,
        });
        const langlinksLookup = langlinks.reduce(
          (obj, d) => ((obj[d.lang] = d), obj),
          {}
        );
        const todaysDate = new Date();
        const thisMonth = yyyymmdd(todaysDate);

        const promises = langlinks.map(ll =>
          fetch(
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${ll.lang}.wikipedia/all-access/all-agents/${ll["*"]}/monthly/20150701/${thisMonth}`
          ).then(y => y.json())
        );
        return [langlinksLookup, promises];
      }
    }
  }
  return [null, null];
}

const formatTimeSeriesData = (timeSeriesDataResps, langlinksLookup) => {
  let langsTs = [];
  let numLangs = 0;
  timeSeriesDataResps.forEach(lr => {
    if (lr.items) {
      numLangs++;
      const wikiLangCode = lr.items[0].project.split(".")[0];
      const langFamily = langFamilies[wikiLangCode] || {
        family_code: "",
        family_name: "",
        lang_code3: "",
        language: "",
        language_local: "",
        primary_family_code: "",
        primary_family_name: "",
      };
      const localUrl = langlinksLookup[wikiLangCode] || {url: ""};
      langsTs = [
        ...langsTs,
        ...lr.items.map(lrd => ({
          ...lrd,
          ...langFamily,
          pageUrl: localUrl.url,
          date: `${lrd.timestamp.substring(0, 4)}/${lrd.timestamp.substring(
            4,
            6
          )}/${lrd.timestamp.substring(6, 8)}`,
        })),
      ];
    }
  });
  return [langsTs, numLangs];
};

export default async function PageViewsByLang({person, slug, title}) {
  const langEditions = await getLangEditions(person.id);
  const [langlinksLookup, timeSeriesDataReqs] = await getTimeSeriesData(
    langEditions,
    person
  );
  const timeSeriesDataResps = await Promise.all(timeSeriesDataReqs);
  const [timeSeriesData, numLangs] = formatTimeSeriesData(
    timeSeriesDataResps,
    langlinksLookup
  );

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <PageViewsByLangSummary
          timeSeriesData={timeSeriesData}
          person={person}
        />
        <PageViewsByLangAreaPlot
          timeSeriesData={timeSeriesData}
          numLangs={numLangs}
        />
      </div>
    </SectionLayout>
  );
}
