import {nest} from "d3-collection";
import {plural} from "pluralize";
import PlacesStacked from "./vizes/PlacesStacked";
import AnchorList from "../../utils/AnchorList";
import {toTitleCase} from "../../utils/vizHelpers";
import {COLORS_CONTINENT} from "../../utils/consts";
import {FORMATTERS} from "../../utils/consts";
import SectionLayout from "../../common/SectionLayout";

async function getEras() {
  const res = await fetch("https://api.pantheon.world/era?order=start_year");
  return res.json();
}

export default async function PlacesOverTime({
  people,
  occupation,
  title,
  slug,
}) {
  const eras = await getEras();

  people = people
    .filter(p => p.birthyear)
    .sort((a, b) => b.birthyear - a.birthyear);
  people.forEach(p => {
    const thisEra = eras.filter(
      e => p.birthyear >= e.start_year && p.birthyear <= e.end_year
    );
    p.era = thisEra.length ? thisEra[0].id : null;
  });
  const oldestPeople = people.slice(Math.max(people.length - 3, 1));

  const peopleByEra = nest()
    .key(p => p.era)
    .entries(people.filter(p => p.era))
    .sort((a, b) => b.values.length - a.values.length);
  const eraWithMostPeople = eras.filter(
    e => e.id.toString() === peopleByEra[0].key
  )[0];

  const tmapBornData = people
    .filter(
      p =>
        p.birthyear !== null &&
        p.bplace_country &&
        p.bplace_country.country &&
        p.bplace_country.continent &&
        p.birthyear >= 1500
    )
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      country: d.bplace_country.country,
      countrySlug: d.bplace_country.slug,
      continent: d.bplace_country.continent,
    }));
  // console.log("tmapBornData", tmapBornData.slice(0, 3));

  // Step 1: Get min/max birth years
  const birthyears = tmapBornData.map(d => d.birthyear);
  const minYear = Math.min(...birthyears);
  const maxYear = Math.max(...birthyears);
  const span = maxYear - minYear;

  // Step 2: Choose cohort size dynamically
  let cohortSize = 5;
  if (span > 60) cohortSize = 20;
  else if (span > 30) cohortSize = 10;

  // Step 3: Function to convert year to cohort label
  function getCohortLabel(year) {
    const start =
      Math.floor((year - minYear) / cohortSize) * cohortSize + minYear;
    const end = start + cohortSize - 1;
    return `${start}–${end}`;
  }

  // Step 4: Aggregate counts by country and cohort
  const countryToContinent = {};
  const cohortCounts = {};
  const cohortSet = new Set();
  const continentLegendSet = new Set();

  tmapBornData.forEach(({country, birthyear, continent}) => {
    const cohort = getCohortLabel(birthyear);
    cohortSet.add(cohort);

    if (!cohortCounts[country]) cohortCounts[country] = {};
    cohortCounts[country][cohort] = (cohortCounts[country][cohort] || 0) + 1;

    countryToContinent[country] = continent;
    continentLegendSet.add(continent);
  });

  // Step 5: Sort cohort labels by numeric start year
  const cohorts = Array.from(cohortSet).sort((a, b) => {
    return parseInt(a.split("–")[0]) - parseInt(b.split("–")[0]);
  });

  // Step 7: Build ECharts series by country
  // First group countries by continent
  const continentGroups = {};
  Object.entries(cohortCounts).forEach(([country, cohortMap]) => {
    const continent = countryToContinent[country];
    if (!continentGroups[continent]) {
      continentGroups[continent] = [];
    }
    continentGroups[continent].push({country, cohortMap});
  });

  // Create series grouped by continent
  const series = Object.entries(continentGroups)
    .sort(([continentA], [continentB]) => continentA.localeCompare(continentB))
    .flatMap(([continent, countries]) => {
      // Sort countries within each continent
      return countries
        .sort((a, b) => a.country.localeCompare(b.country))
        .map(({country, cohortMap}) => ({
          name: country,
          type: "line",
          stack: "total",
          areaStyle: {},
          emphasis: {focus: "series"},
          itemStyle: {
            color: COLORS_CONTINENT[continent] || "#aaa",
          },
          data: cohorts.map(c => cohortMap[c] || 0),
          triggerLineEvent: true,
        }));
    });

  // const tmapDeathData = people
  //   .filter(
  //     p =>
  //       p.deathyear !== null &&
  //       p.dplace_country &&
  //       p.dplace_country.country &&
  //       p.dplace_country.continent
  //   )
  //   .sort((a, b) => b.l - a.l)
  //   .map(d => ({
  //     ...d,
  //     country: d.dplace_country.country,
  //     countrySlug: d.dplace_country.slug,
  //     continent: d.dplace_country.continent,
  //   }));

  const option = {
    title: {
      text: `Birth Places of ${toTitleCase(
        plural(occupation.occupation)
      )} Over Time`,
      left: "center",
    },
    legend: {
      type: "scroll",
      data: Array.from(continentLegendSet),
      top: "bottom",
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: cohorts,
    },
    yAxis: {
      type: "value",
    },
    series,
  };

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          The earliest biographies classified as{" "}
          {plural(occupation.occupation.toLowerCase())} in Pantheon are{" "}
          <AnchorList
            items={oldestPeople}
            name={d => d.name}
            url={d => `/profile/person/${d.slug}/`}
          />
          .&nbsp; The concentration of{" "}
          {plural(occupation.occupation.toLowerCase())} was largest during the{" "}
          <a href={`/profile/era/${eraWithMostPeople.slug}`}>
            {eraWithMostPeople.name}
          </a>
          , which lasted from {FORMATTERS.year(eraWithMostPeople.start_year)} to{" "}
          {FORMATTERS.year(eraWithMostPeople.end_year)}. Some birth or death
          locations for earlier {plural(occupation.occupation.toLowerCase())}{" "}
          are unknown, which may account for timeline differences below.
        </p>
      </div>
      {tmapBornData.length ? (
        <div className="viz">
          <PlacesStacked baseOption={option} cohorts={cohorts} />
        </div>
      ) : null}
      {/* {tmapDeathData.length ? (
        <PlacesStacked
          data={tmapDeathData}
          groupByKey={["diedcontinent", "diedcountry"]}
          title={`Death Places of ${toTitleCase(
            plural(occupation.occupation)
          )}`}
        />
      ) : null} */}
    </SectionLayout>
  );
}
