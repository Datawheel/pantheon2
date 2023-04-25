import { nest } from "d3-collection";
import { plural } from "pluralize";
import PlacesTmap from "./vizes/PlacesTmap";
import AnchorList from "../../utils/AnchorList";
import { toTitleCase } from "../../utils/vizHelpers";
import SectionLayout from "../../common/SectionLayout";

export default function Places({ people, occupation, title, slug }) {
  const countriesBorn = nest()
    .key((p) => p.bplace_country.id)
    .rollup((leaves) => ({
      num_people: leaves.length,
      bplace_country: leaves[0].bplace_country,
    }))
    .entries(people.filter((p) => p.bplace_country))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesBorn = nest()
    .key((p) => p.bplace_geonameid.id)
    .rollup((leaves) => ({
      num_people: leaves.length,
      bplace_geonameid: leaves[0].bplace_geonameid,
    }))
    .entries(people.filter((p) => p.bplace_geonameid))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  const countriesDied = nest()
    .key((p) => p.dplace_country.id)
    .rollup((leaves) => ({
      num_people: leaves.length,
      dplace_country: leaves[0].dplace_country,
    }))
    .entries(people.filter((p) => p.dplace_country))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesDied = nest()
    .key((p) => p.dplace_geonameid.id)
    .rollup((leaves) => ({
      num_people: leaves.length,
      dplace_geonameid: leaves[0].dplace_geonameid,
    }))
    .entries(people.filter((p) => p.dplace_geonameid))
    .sort((a, b) => b.value.num_people - a.value.num_people);

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

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Most {plural(occupation.occupation.toLowerCase())} were born in{" "}
          <AnchorList
            items={countriesBorn.slice(0, 3)}
            name={(d) =>
              `${d.value.bplace_country.country} (${d.value.num_people})`
            }
            url={(d) => `/profile/country/${d.value.bplace_country.slug}/`}
          />
          . By city, the most common birth places were{" "}
          <AnchorList
            items={placesBorn.slice(0, 3)}
            name={(d) =>
              `${d.value.bplace_geonameid.place} (${d.value.num_people})`
            }
            url={(d) => `/profile/place/${d.value.bplace_geonameid.slug}/`}
          />
          .
          {tmapDeathData.length ? (
            <>
              The most common death places of{" "}
              {plural(occupation.occupation.toLowerCase())} were{" "}
              <AnchorList
                items={countriesDied.slice(0, 3)}
                name={(d) =>
                  `${d.value.dplace_country.country} (${d.value.num_people})`
                }
                url={(d) => `/profile/country/${d.value.dplace_country.slug}/`}
              />
              . By city, these were{" "}
              <AnchorList
                items={placesDied.slice(0, 3)}
                name={(d) =>
                  `${d.value.dplace_geonameid.place} (${d.value.num_people})`
                }
                url={(d) => `/profile/place/${d.value.dplace_geonameid.slug}/`}
              />
              .
            </>
          ) : null}
        </p>
      </div>
      {tmapBornData.length ? (
        <PlacesTmap
          data={tmapBornData}
          title={`Birth Places of ${toTitleCase(
            plural(occupation.occupation)
          )}`}
        />
      ) : null}
      {tmapDeathData.length ? (
        <PlacesTmap
          data={tmapDeathData}
          title={`Death Places of ${toTitleCase(
            plural(occupation.occupation)
          )}`}
        />
      ) : null}
    </SectionLayout>
  );
}
