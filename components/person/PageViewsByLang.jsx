"use client";

import langFamilies from "/data/langFamilies.json";
import PageViewsByLangSummary from "/components/person/PageViewsByLangSummary";
// import PageViewsByLangAreaPlot from "/components/person/PageViewByLangAreaPlot";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {BASE_API} from "@/app/constants";

// Load EChart only on the client
const EChart = dynamic(() => import("/components/EChart"), {ssr: false});

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

export default function PageViewsByLang({person, slug, title}) {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [numLangs, setNumLangs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_API}/pageviews?wp_id=eq.${person.id}`
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
        <div>Loading...</div>
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

  // Group by date and language
  [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ];
  const familyColors = {
    "Indo-European": "#5470c6", // Indo-European
    "Sino-Tibetan": "#91cc75", // Sino-Tibetan
    "Afro-Asiatic": "#fac858", // Afro-Asiatic
    "Altaic": "#ee6666", // Altaic
    "Dravidian": "#73c0de", // Dravidian
    "Niger-Congo": "#3ba272", // Niger-Congo
    "Austro-Asiatic": "#fc8452", // Austro-Asiatic
    "Tai-Kadai": "#9a60b4", // Tai-Kadai
    "Austronesian": "#ea7ccc", // Austronesian
    "Uralic": "#5470c6",
    "Caucasian": "#91cc75",
    "Niger-Kordofanian": "#fac858",
    "Creoles and pidgins": "#ee6666",
    "Amerindian": "#9a60b4",
    "Tai": "#3ba272",
    "Turkic": "#fc8452",
    "": "#ccc",
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
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  const series = Object.values(seriesMap)
    .map(({name, family, values}) => ({
      name: family,
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

  const option = {
    grid: {
      left: "4%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    legend: {
      type: "scroll",
      data: Array.from(familyLegendSet),
      bottom: 0,
      left: "center",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: allDates,
    },
    yAxis: {
      type: "value",
      name: "Pageviews by language edition",
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
