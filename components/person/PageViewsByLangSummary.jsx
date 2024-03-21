"use client";
import {max as D3Max, mean as D3Mean, sum as D3Sum} from "d3-array";
import {nest} from "d3-collection";
import dayjs from "dayjs";
import {Tooltip} from "@blueprintjs/core";
import {FORMATTERS} from "../utils/consts";
import AnchorList from "../utils/AnchorList";

export default function PageViewsByLangSummary({timeSeriesData, person}) {
  // get most recent month
  const latestDate = D3Max(timeSeriesData, d => dayjs(d.date, "YYYY/MM/DD"));

  // get prev year, and 2 years ago for year bounds
  const dataPastYear = timeSeriesData.filter(
    d => dayjs(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(1, "year")
  );
  const dataPrevPastYear = timeSeriesData.filter(
    d =>
      dayjs(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(2, "year") &&
      dayjs(d.date, "YYYY/MM/DD") <= latestDate.clone().subtract(1, "year")
  );

  // group past year (and year previous) by wiki edition
  const dataPastYearAgg = nest()
    .key(d => d.project)
    .rollup(leaves => ({
      views: D3Sum(leaves, d => d.views),
      project: leaves[0].project,
      article: leaves[0].article,
      language: leaves[0].language,
      language_local: leaves[0].language_local,
      family_name: leaves[0].family_name,
      primary_family_name: leaves[0].primary_family_name,
      pageUrl: leaves[0].pageUrl,
      year: Math.ceil(D3Mean(leaves, d => dayjs(d.date, "YYYY/MM/DD").year())),
    }))
    .entries(dataPastYear)
    .map(d => d.value)
    .sort((a, b) => b.views - a.views);
  const dataPrevPastYearAgg = nest()
    .key(d => d.project)
    .rollup(leaves => ({
      views: D3Sum(leaves, d => d.views),
      project: leaves[0].project,
      article: leaves[0].article,
      language: leaves[0].language,
      language_local: leaves[0].language_local,
      family_name: leaves[0].family_name,
      primary_family_name: leaves[0].primary_family_name,
      pageUrl: leaves[0].pageUrl,
      year: Math.ceil(D3Mean(leaves, d => dayjs(d.date, "YYYY/MM/DD").year())),
    }))
    .entries(dataPrevPastYear)
    .map(d => d.value);

  // merge past 2 years and align for growth calculation
  const dataProjectGrowth = nest()
    .key(d => d.project)
    .rollup(leaves => ({
      growth: leaves.length > 1 ? leaves[0].views - leaves[1].views : null,
      growthPct:
        leaves.length > 1
          ? (leaves[0].views - leaves[1].views) / leaves[1].views
          : null,
      vals: leaves,
      ...leaves[0],
    }))
    .entries(dataPastYearAgg.concat(dataPrevPastYearAgg))
    .map(d => d.value)
    .sort((a, b) => b.growthPct - a.growthPct);
  // console.log("dataPastYear", dataPastYear);
  // console.log("dataPrevPastYear", dataPrevPastYear);
  // console.log("dataPastYearAgg", dataPastYearAgg);
  // console.log("dataPrevPastYearAgg", dataPrevPastYearAgg);
  // console.log("dataProjectGrowth", dataProjectGrowth);

  return (
    <p>
      Over the past year {person.name} has had the most page views in the{" "}
      <Tooltip
        content={`${dataPastYearAgg[0].language} (${dataPastYearAgg[0].language_local}) is a ${dataPastYearAgg[0].family_name} language in the ${dataPastYearAgg[0].primary_family_name} family of languages.`}
      >
        <a href={dataPastYearAgg[0].pageUrl} target="_blank" rel="noopener">
          {dataPastYearAgg[0].language} wikipedia edition
        </a>
      </Tooltip>{" "}
      with {FORMATTERS.commas(dataPastYearAgg[0].views)} views, followed by{" "}
      <AnchorList
        items={dataPastYearAgg.slice(1, 3)}
        name={d => `${d.language} (${FORMATTERS.commas(d.views)})`}
        url={d => d.pageUrl}
        tooltip={d =>
          `${d.language} (${d.language_local}) is a ${d.family_name} language in the ${d.primary_family_name} family of languages.`
        }
        newWindow={true}
      />
      . In terms of yearly growth of page views the top 3 wikpedia editions are{" "}
      <AnchorList
        items={dataProjectGrowth.slice(0, 3)}
        name={d => `${d.language} (${FORMATTERS.share(d.growthPct)})`}
        url={d => d.pageUrl}
        tooltip={d =>
          `${d.language} (${d.language_local}) is a ${d.family_name} language in the ${d.primary_family_name} family of languages.`
        }
        newWindow={true}
      />
    </p>
  );
}
