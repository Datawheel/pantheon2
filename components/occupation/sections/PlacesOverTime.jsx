import { nest } from "d3-collection";
import { plural } from "pluralize";
import PlacesStacked from "./vizes/PlacesStacked";
import AnchorList from "../../utils/AnchorList";
import { calculateYearBucket, toTitleCase } from "../../utils/vizHelpers";
import { FORMATTERS } from "../../utils/consts";
import SectionLayout from "../../common/SectionLayout";

async function getEras() {
  const res = await fetch(
    `https://api-dev.pantheon.world/era?order=start_year`
  );
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
    .filter((p) => p.birthyear)
    .sort((a, b) => b.birthyear - a.birthyear);
  people.forEach((p) => {
    const thisEra = eras.filter(
      (e) => p.birthyear >= e.start_year && p.birthyear <= e.end_year
    );
    p.era = thisEra.length ? thisEra[0].id : null;
  });
  const oldestPeople = people.slice(Math.max(people.length - 3, 1));

  const peopleByEra = nest()
    .key((p) => p.era)
    .entries(people.filter((p) => p.era))
    .sort((a, b) => b.values.length - a.values.length);
  const eraWithMostPeople = eras.filter(
    (e) => e.id.toString() === peopleByEra[0].key
  )[0];

  const tmapBornData = people
    .filter(
      (p) =>
        p.birthyear !== null &&
        p.bplace_country &&
        p.bplace_country.country &&
        p.bplace_country.continent
    )
    .sort((a, b) => b.l - a.l)
    .map((d) => ({
      ...d,
      country: d.bplace_country.country,
      continent: d.bplace_country.continent,
    }));

  const tmapDeathData = people
    .filter(
      (p) =>
        p.deathyear !== null &&
        p.dplace_country &&
        p.dplace_country.country &&
        p.dplace_country.continent
    )
    .sort((a, b) => b.l - a.l)
    .map((d) => ({
      ...d,
      country: d.dplace_country.country,
      continent: d.dplace_country.continent,
    }));

  const [bornBuckets, bornTicks] = calculateYearBucket(
    tmapBornData,
    (d) => d.birthyear
  );
  const [deathBuckets, deathTicks] = calculateYearBucket(
    tmapDeathData,
    (d) => d.deathyear
  );

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          The earliest biographies classified as{" "}
          {plural(occupation.occupation.toLowerCase())} in Pantheon are{" "}
          <AnchorList
            items={oldestPeople}
            name={(d) => d.name}
            url={(d) => `/profile/person/${d.slug}/`}
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
        <PlacesStacked
          data={tmapBornData}
          title={`Birth Places of ${toTitleCase(
            plural(occupation.occupation)
          )} Over Time`}
          buckets={bornBuckets}
          ticks={bornTicks}
        />
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
