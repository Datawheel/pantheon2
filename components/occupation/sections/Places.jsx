import {nest} from "d3-collection";
import {plural} from "pluralize";
import AnchorList from "../../utils/AnchorList";
import {toTitleCase} from "../../utils/vizHelpers";
import SectionLayout from "../../common/SectionLayout";
import dynamic from "next/dynamic";
import {COLORS_CONTINENT} from "../../utils/consts";
// Load EChart only on the client
const PlacesTmap = dynamic(
  () => import("/components/occupation/sections/vizes/PlacesTmap"),
  {ssr: false}
);

const nestDataForTmap = (acc, person, accessor = "bplace_country") => {
  const continent = person[accessor].continent;
  const country = person[accessor].country;

  // Initialize continent if it doesn't exist
  if (!acc[continent]) {
    acc[continent] = {
      name: continent,
      value: 0,
      children: [],
    };
  }

  // Find or create country within continent
  let countryNode = acc[continent].children.find(c => c.name === country);
  if (!countryNode) {
    countryNode = {
      name: country,
      value: 0,
    };
    acc[continent].children.push(countryNode);
  }

  // Update values
  countryNode.value += 1;
  acc[continent].value += 1;

  return acc;
};

export default function Places({people, occupation, title, slug}) {
  const countriesBorn = nest()
    .key(p => p.bplace_country.id)
    .rollup(leaves => ({
      num_people: leaves.length,
      bplace_country: leaves[0].bplace_country,
    }))
    .entries(people.filter(p => p.bplace_country))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesBorn = nest()
    .key(p => p.bplace_geonameid.id)
    .rollup(leaves => ({
      num_people: leaves.length,
      bplace_geonameid: leaves[0].bplace_geonameid,
    }))
    .entries(people.filter(p => p.bplace_geonameid))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  const countriesDied = nest()
    .key(p => p.dplace_country.id)
    .rollup(leaves => ({
      num_people: leaves.length,
      dplace_country: leaves[0].dplace_country,
    }))
    .entries(people.filter(p => p.dplace_country))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesDied = nest()
    .key(p => p.dplace_geonameid.id)
    .rollup(leaves => ({
      num_people: leaves.length,
      dplace_geonameid: leaves[0].dplace_geonameid,
    }))
    .entries(people.filter(p => p.dplace_geonameid))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  const tmapBornData = people
    .filter(
      p =>
        p.birthyear !== null &&
        p.bplace_country &&
        p.bplace_country.country &&
        p.bplace_country.continent
    )
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      country: d.bplace_country.country,
      countrySlug: d.bplace_country.slug,
      continent: d.bplace_country.continent,
    }))
    .reduce(
      (acc, person) => nestDataForTmap(acc, person, "bplace_country"),
      {}
    );

  const tmapDeathData = people
    .filter(
      p =>
        p.deathyear !== null &&
        p.dplace_country &&
        p.dplace_country.country &&
        p.dplace_country.continent
    )
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      country: d.dplace_country.country,
      countrySlug: d.dplace_country.slug,
      continent: d.dplace_country.continent,
    }))
    .reduce(
      (acc, person) => nestDataForTmap(acc, person, "dplace_country"),
      {}
    );

  const genericOption = {
    title: {
      text: `Birth Places of ${toTitleCase(plural(occupation.occupation))}`,
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    series: [
      {
        type: "treemap",
        top: 30,
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
        breadcrumb: {show: false},
        label: {
          rich: {
            name: {
              align: "left",
              verticalAlign: "top",
              fontSize: 14,
              fontWeight: "bold",
            },
            percent: {
              align: "left",
              verticalAlign: "bottom",
              lineHeight: 17,
              fontSize: 12,
              color: "#f4f4f1",
            },
          },
        },
        itemStyle: {
          borderColor: "#f4f4f1",
          borderWidth: 1,
        },
        data: Object.values(tmapBornData),
        roam: false,
      },
    ],
  };

  const bplaceOption = {
    ...genericOption,
    title: {
      ...genericOption.title,
      text: `Birth Places of ${toTitleCase(plural(occupation.occupation))}`,
    },
    series: [
      {
        ...genericOption.series[0],
        data: Object.values(tmapBornData),
      },
    ],
  };

  const dplaceOption = {
    ...genericOption,
    title: {
      ...genericOption.title,
      text: `Death Places of ${toTitleCase(plural(occupation.occupation))}`,
    },
    series: [
      {
        ...genericOption.series[0],
        data: Object.values(tmapDeathData),
      },
    ],
  };

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Most {plural(occupation.occupation.toLowerCase())} were born in{" "}
          <AnchorList
            items={countriesBorn.slice(0, 3)}
            name={d =>
              `${d.value.bplace_country.country} (${d.value.num_people})`
            }
            url={d => `/profile/country/${d.value.bplace_country.slug}/`}
          />
          . By city, the most common birth places were{" "}
          <AnchorList
            items={placesBorn.slice(0, 3)}
            name={d =>
              `${d.value.bplace_geonameid.place} (${d.value.num_people})`
            }
            url={d => `/profile/place/${d.value.bplace_geonameid.slug}/`}
          />
          .
          {tmapDeathData.length ? (
            <>
              The most common death places of{" "}
              {plural(occupation.occupation.toLowerCase())} were{" "}
              <AnchorList
                items={countriesDied.slice(0, 3)}
                name={d =>
                  `${d.value.dplace_country.country} (${d.value.num_people})`
                }
                url={d => `/profile/country/${d.value.dplace_country.slug}/`}
              />
              . By city, these were{" "}
              <AnchorList
                items={placesDied.slice(0, 3)}
                name={d =>
                  `${d.value.dplace_geonameid.place} (${d.value.num_people})`
                }
                url={d => `/profile/place/${d.value.dplace_geonameid.slug}/`}
              />
              .
            </>
          ) : null}
        </p>
      </div>

      {Object.values(tmapBornData).length ? (
        <div className="viz">
          <PlacesTmap baseOption={bplaceOption} />
        </div>
      ) : null}

      {Object.values(tmapDeathData).length ? (
        <div className="viz">
          <PlacesTmap baseOption={dplaceOption} />
        </div>
      ) : null}
    </SectionLayout>
  );
}
