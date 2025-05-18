"use client";

import langFamilies from "/data/langFamilies.json";
import PageViewsByLangSummary from "/components/person/PageViewsByLangSummary";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {BASE_API} from "@/app/constants";

// Load EChart only on the client
const PageViewsByLangAreaPlot = dynamic(
  () => import("/components/person/PageViewByLangAreaPlot"),
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
  // const langFamColors = {
  //   "afa": "#cdc84c",
  //   "cau": "#0E5E5B",
  //   "": "#67AF8C",
  //   "ine": "#B12D11",
  //   "nic": "#732945",
  //   "tut": "#4C5ED7",
  //   "crp": "#4F680A",
  //   "sit": "#D28629",
  //   "map": "#260348",
  //   "urj": "#160B5B",
  //   "dra": "#162A6D",
  //   "tai": "#255A7F",
  // };
  const familyColors = {
    "Indo-European": "#B12D11", // Indo-European
    "Sino-Tibetan": "#D28629", // Sino-Tibetan
    "Afro-Asiatic": "#cdc84c", // Afro-Asiatic
    "Altaic": "#4C5ED7", // Altaic
    "Dravidian": "#162A6D", // Dravidian
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
        <PageViewsByLangAreaPlot baseOption={option} />
      </div>
    </SectionLayout>
  );
}
