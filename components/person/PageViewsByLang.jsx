import langFamilies from "/data/langFamilies.json";
import PageViewsByLangSummary from "/components/person/PageViewsByLangSummary";
// import PageViewsByLangAreaPlot from "/components/person/PageViewByLangAreaPlot";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";

import dynamic from "next/dynamic";

// Load EChart only on the client
const EChart = dynamic(() => import("/components/EChart"), {ssr: false});

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

  // Group by date and language
  const familyColors = {};
  const colorPalette = [
    "#5470C6",
    "#91CC75",
    "#EE6666",
    "#73C0DE",
    "#FAC858",
    "#3BA272",
    "#FC8452",
    "#9A60B4",
    "#EA7CCC",
  ];
  let colorIndex = 0;

  const allDatesSet = new Set();
  const seriesMap = {};
  const familyLegendSet = new Set();
  const languageToFamily = {};
  timeSeriesData.forEach(d => {
    const yearMonth = d.date.slice(0, 7);

    const [year, month] = yearMonth.split("/");
    const date = new Date(year, parseInt(month) - 1);
    const label = date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    const langKey = `${d.language}`;
    const family = d.primary_family_name;

    allDatesSet.add(label);
    familyLegendSet.add(family);
    languageToFamily[langKey] = family;

    if (!seriesMap[langKey]) {
      seriesMap[langKey] = {name: langKey, family, values: {}};
    }
    seriesMap[langKey].values[label] =
      (seriesMap[langKey].values[label] || 0) + d.views;
  });

  const allDates = Array.from(allDatesSet);

  // Assign each family a color
  familyLegendSet.forEach(family => {
    familyColors[family] = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;
  });

  const series = Object.values(seriesMap).map(({name, family, values}) => ({
    name: family,
    type: "line",
    stack: "views",
    symbol: "none",
    areaStyle: {},
    emphasis: {focus: "series"},
    itemStyle: {
      color: familyColors[family],
    },
    lineStyle: {
      color: familyColors[family],
    },
    areaStyle: {
      color: familyColors[family],
    },
    data: allDates.map(date => ({
      value: values[date] || 0,
      langLabel: name, // <- store original language name
    })),
  }));

  // First, calculate the maximum point
  const totalsByDate = allDates.map((date, dateIndex) => {
    const total = series.reduce((sum, s) => {
      return sum + (s.data[dateIndex]?.value || 0);
    }, 0);
    return {date, total};
  });

  // Find the date with maximum total
  const maxPoint = totalsByDate.reduce(
    (max, curr) => (curr.total > max.total ? curr : max),
    totalsByDate[0]
  );

  const option = {
    // tooltip: {trigger: "axis"},
    grid: {
      left: "4%",
      right: "4%",
      bottom: "15%", // Add some space at the bottom for the legend
      containLabel: true,
    },
    legend: {
      type: "scroll",
      data: Array.from(familyLegendSet),
      bottom: 0, // Places the legend at the bottom
      left: "center", // Centers the legend horizontally
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: allDates, // now formatted as ["Jul 2015", "Aug 2015", ...]
    },
    yAxis: {
      type: "value",
      name: "Pageviews by language edition",
      nameLocation: "middle", // Places the label in the middle of the axis
      nameGap: 65, // Adds some space between the axis and the label
      nameTextStyle: {
        // Styles the axis label text
        fontSize: 18,
        fontWeight: "normal",
      },
    },
    series: [
      // Add markPoint to the last series to show at the top of the stack
      ...series.slice(0, -1),
      {
        // Last series configuration
        ...series[series.length - 1],
        markPoint: {
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#EE6666", // Set to red
          },
          data: [
            {
              coord: [maxPoint.date, maxPoint.total],
              label: {
                show: true,
                formatter: `${
                  maxPoint.date
                }\n${maxPoint.total.toLocaleString()} views`,
                position: "top",
                distance: 10,
                textStyle: {
                  fontSize: 12,
                },
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <PageViewsByLangSummary
          timeSeriesData={timeSeriesData}
          person={person}
        />
        {/* <PageViewsByLangAreaPlot
          timeSeriesData={timeSeriesData}
          numLangs={numLangs}
        /> */}
        <EChart baseOption={option} />
      </div>
    </SectionLayout>
  );
}
