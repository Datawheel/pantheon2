import {nest} from "d3-collection";
import {plural} from "pluralize";
import AnchorList from "../../utils/AnchorList";
import SectionLayout from "../../common/SectionLayout";
import OccupationsTmap from "../../place/sections/vizes/OccupationsTmap";

export default async function Occupations({
  attrs,
  country,
  peopleBorn,
  peopleDied,
  title,
  slug,
}) {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach(d => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.bplace_geonameid;
  });

  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l);

  tmapDeathData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.dplace_geonameid;
  });

  const occupationsBorn = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({
      num_born: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries(peopleBorn.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value);
  const occupationsDied = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({
      num_died: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries(peopleDied.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value);

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Most individuals born in present day {country.country} were&nbsp;
          <AnchorList
            items={occupationsBorn.slice(0, 5)}
            name={d =>
              `${plural(d.occupation.occupation.toLowerCase())} (${d.num_born})`
            }
            url={d => `/profile/occupation/${d.occupation.occupation_slug}`}
          />
          ,&nbsp; while most who died were&nbsp;
          <AnchorList
            items={occupationsDied.slice(0, 5)}
            name={d =>
              `${plural(d.occupation.occupation.toLowerCase())} (${d.num_died})`
            }
            url={d => `/profile/occupation/${d.occupation.occupation_slug}`}
          />
          .
        </p>
      </div>
      {occupationsBorn.length ? (
        <OccupationsTmap
          attrs={attrs}
          data={tmapBornData}
          title={`Occupations of People Born in present day ${country.country}`}
        />
      ) : null}
      {occupationsDied.length ? (
        <OccupationsTmap
          attrs={attrs}
          data={tmapDeathData}
          title={`Occupations of People Deceased in present day ${country.country}`}
        />
      ) : null}
    </SectionLayout>
  );
}
