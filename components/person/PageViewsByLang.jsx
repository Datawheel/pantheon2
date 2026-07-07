"use client";

import langFamilies from "@/data/langFamilies.json";
import PageViewsByLangSummary from "@/components/person/PageViewsByLangSummary";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {PUBLIC_API} from "@/app/constants";
import {getTranslations} from "@/app/translations";

// Load EChart only on the client
const PageViewsByLangAreaPlot = dynamic(
  () => import("@/components/person/PageViewByLangAreaPlot"),
  {ssr: false}
);

const formatTimeSeriesData = pageviewsData => {
  let langsTs = [];
  let numLangs = 0;

  // Group data by language
  const langGroups = pageviewsData.reduce((acc, item) => {
    if (!acc[item.lang]) {
      acc[item.lang] = [];
    }
    acc[item.lang].push(item);
    return acc;
  }, {});

  Object.entries(langGroups).forEach(([lang, items]) => {
    numLangs++;
    // if (!langFamilies[lang]) {
    //   console.log(lang);
    // }
    const langFamily = langFamilies[lang] || {
      family_code: "",
      family_name: "",
      lang_code3: "",
      language: "",
      language_local: "",
      primary_family_code: "",
      primary_family_name: "",
    };

    langsTs = [
      ...langsTs,
      ...items.map(item => ({
        ...item,
        ...langFamily,
        article: item.slug,
        project: `${item.lang}.wikipedia`,
        pageUrl: `https://${item.lang}.wikipedia.org/wiki/${item.title}`,
        date: item.date.replace(/-/g, "/"), // Convert YYYY-MM-DD to YYYY/MM/DD
      })),
    ];
  });

  return [langsTs, numLangs];
};

const EN_MONTHS = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};

// Axis categories are built (and sorted) as en-US "Mon YYYY" keys; localize
// them only at display time. Formatter functions don't survive the JSON
// clone in PageViewsByLangAreaPlot, so the category strings themselves carry
// the localized label.
const localizeMonthLabel = (label, lang) => {
  if (lang === "en" || !label) return label;
  const [mon, year] = label.split(" ");
  const monthIndex = EN_MONTHS[mon];
  if (monthIndex === undefined || !year) return label;
  return new Date(Number(year), monthIndex).toLocaleDateString(lang, {
    month: "short",
    year: "numeric",
  });
};

const calculateCumulativeLanguages = (timeSeriesData, allDates) => {
  // First pass: group languages by date (O(m) where m = data points)
  const languagesByDate = {};

  timeSeriesData.forEach(d => {
    const yearMonth = d.date.slice(0, 7);
    const [year, month] = yearMonth.split("/");
    const itemDate = new Date(year, parseInt(month) - 1);
    const label = itemDate.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!languagesByDate[label]) {
      languagesByDate[label] = new Set();
    }
    languagesByDate[label].add(d.lang);
  });

  // Second pass: accumulate languages over time (O(n) where n = dates)
  const languagesSeen = new Set();
  const cumulativeData = [];

  allDates.forEach(date => {
    // Add any new languages from this date
    if (languagesByDate[date]) {
      languagesByDate[date].forEach(lang => languagesSeen.add(lang));
    }

    cumulativeData.push({
      date: date,
      count: languagesSeen.size,
    });
  });

  return cumulativeData;
};

export default function PageViewsByLang({person, slug, title, lang = "en"}) {
  const t = getTranslations(lang);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [numLangs, setNumLangs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pageviews"); // 'pageviews' | 'editions'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${PUBLIC_API}/pageviews_ch?wp_id=eq.${person.id}`
        );
        const data = await response.json();
        const [formattedData, langCount] = formatTimeSeriesData(data);
        setTimeSeriesData(formattedData);
        setNumLangs(langCount);
      } catch (error) {
        console.error("Error fetching pageviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [person.id]);

  if (loading) {
    return (
      <SectionLayout slug={slug} title={title}>
        <div>{t.person.loading}</div>
      </SectionLayout>
    );
  }

  if (timeSeriesData.length === 0) {
    return (
      <SectionLayout slug={slug} title={title}>
        <div></div>
      </SectionLayout>
    );
  }

  const familyColors = {
    "Indo-European": "#B12D11", // red
    "Sino-Tibetan": "#D28629", // orange
    "Afro-Asiatic": "#cdc84c", // yellow
    "Altaic": "#4C5ED7", // blue
    "Dravidian": "#162A6D", // green
    "Austronesian": "#260348", // Austronesian
    "Uralic": "#160B5B",
    "Caucasian": "#0E5E5B",
    "Niger-Kordofanian": "#732945",
    "Creoles and pidgins": "#4F680A",
    "Amerindian": "#67AF8C",
    "Tai": "#255A7F",
    "": "#67AF8C",
  };

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

  const allDates = Array.from(allDatesSet).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    const months = {
      "Jan": 0,
      "Feb": 1,
      "Mar": 2,
      "Apr": 3,
      "May": 4,
      "Jun": 5,
      "Jul": 6,
      "Aug": 7,
      "Sep": 8,
      "Oct": 9,
      "Nov": 10,
      "Dec": 11,
    };
    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }
    return months[monthA] - months[monthB];
  });

  const tChart = t.person.pageViewsByLangChart;
  const familyLabel = f => tChart.families?.[f] || f;
  const displayDates = allDates.map(d => localizeMonthLabel(d, lang));

  const series = Object.values(seriesMap)
    .map(({name, family, values}) => ({
      name: familyLabel(family),
      type: "line",
      stack: "views",
      symbol: "none",
      areaStyle: {},
      emphasis: {focus: "series"},
      itemStyle: {
        color: familyColors[family] || familyColors[""],
      },
      lineStyle: {
        color: familyColors[family] || familyColors[""],
      },
      areaStyle: {
        color: familyColors[family] || familyColors[""],
      },
      data: allDates.map(date => ({
        value: values[date] || 0,
        langLabel: name,
      })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calculate the maximum point
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
  // Right-align the annotation when the peak sits near the chart's right
  // edge, so localized (longer) labels don't get clipped.
  const maxPointNearRightEdge =
    allDates.indexOf(maxPoint.date) > allDates.length * 0.85;

  const pageviewsOption = {
    grid: {
      left: "4%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    legend: {
      type: "scroll",
      data: Array.from(familyLegendSet).map(familyLabel),
      bottom: 0,
      left: "center",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: displayDates,
    },
    yAxis: {
      type: "value",
      name: tChart.pageviewsByLanguageEdition,
      nameLocation: "middle",
      nameGap: 65,
      nameTextStyle: {
        fontSize: 18,
        fontWeight: "normal",
      },
    },
    series: [
      ...series.slice(0, -1),
      {
        ...series[series.length - 1],
        markPoint: {
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#EE6666",
          },
          data: [
            {
              coord: [localizeMonthLabel(maxPoint.date, lang), maxPoint.total],
              label: {
                show: true,
                formatter: `${localizeMonthLabel(maxPoint.date, lang)}\n${tChart.viewsAnnotation(
                  {countFormatted: maxPoint.total.toLocaleString(lang)},
                )}`,
                position: "top",
                distance: 10,
                fontSize: 12,
                align: maxPointNearRightEdge ? "right" : "center",
              },
            },
          ],
        },
      },
    ],
  };

  // Select which option to use based on view mode
  // Only calculate language editions option when user clicks that view
  let option;
  if (viewMode === "editions") {
    // Calculate cumulative languages data only when needed
    const cumulativeLanguagesData = calculateCumulativeLanguages(
      timeSeriesData,
      allDates
    );

    option = {
      grid: {
        left: "4%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      legend: {
        show: false,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: displayDates,
      },
      yAxis: {
        type: "value",
        name: tChart.cumulativeLanguageEditions,
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: {
          fontSize: 16,
        },
        minInterval: 1,
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const date = params[0].axisValueLabel;
          const count = params[0].data;
          return `<strong>${date}</strong><br/>${t.person.pageViewsByLangChart.languageEditions}: <strong>${count}</strong>`;
        },
      },
      series: [
        {
          name: t.person.pageViewsByLangChart.languageEditions,
          type: "line",
          step: "end",
          symbol: "circle",
          symbolSize: 6,
          lineStyle: {
            color: "#36687F",
            width: 2,
          },
          itemStyle: {
            color: "#36687F",
          },
          data: cumulativeLanguagesData.map(d => d.count),
          markPoint: {
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: "#B12D11",
            },
            data: [
              {
                type: "max",
                label: {
                  show: true,
                  // String template ({c} = value): function formatters are
                  // stripped by the JSON clone in the area-plot wrapper.
                  formatter: `{c} ${tChart.editionsWord}`,
                  position: "top",
                  distance: 10,
                  fontSize: 12,
                },
              },
            ],
          },
        },
      ],
    };
  } else {
    option = pageviewsOption;
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <PageViewsByLangSummary
          timeSeriesData={timeSeriesData}
          person={person}
          lang={lang}
        />
        <div className="chart-view-toggle">
          <button
            className={viewMode === "pageviews" ? "active" : ""}
            onClick={() => setViewMode("pageviews")}
          >
            {t.person.metrics.pageViews}
          </button>
          <button
            className={viewMode === "editions" ? "active" : ""}
            onClick={() => setViewMode("editions")}
          >
            {tChart.languageEditions}
          </button>
        </div>
        {/* <PageViewsByLangAreaPlot
          timeSeriesData={timeSeriesData}
          numLangs={numLangs}
        /> */}
        <PageViewsByLangAreaPlot baseOption={option} lang={lang} />
      </div>
    </SectionLayout>
  );
}
