import {nest} from "d3-collection";
import {plural} from "pluralize";
import AnchorList from "../../utils/AnchorList";
import SectionLayout from "../../common/SectionLayout";
import OccupationsTmap from "../../place/sections/vizes/OccupationsTmap";

export default async function Occupations({
  era,
  peopleBorn,
  peopleDied,
  attrs,
  title,
  slug,
}) {
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
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value);

  const tmapBornData = peopleBorn
    .filter(
      p => p.birthyear !== null && p.bplace_country !== null && p.occupation
    )
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "OCCUPATIONS OF FAMOUS PEOPLE BORN IN THIS ERA";
    d.place = d.bplace_geonameid;
  });

  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null && p.occupation)
    .sort((a, b) => b.langs - a.langs);

  tmapDeathData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "OCCUPATIONS OF FAMOUS PEOPLE DECEASED IN THIS ERA";
    d.place = d.dplace_geonameid;
  });

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Most individuals born in the {era.name} were&nbsp;
          <AnchorList
            items={occupationsBorn.slice(0, 5)}
            name={d => `${plural(d.occupation.occupation)} (${d.num_born})`}
            url={d => `/profile/occupation/${d.occupation.occupation_slug}`}
          />
          ,&nbsp; while most who died were&nbsp;
          <AnchorList
            items={occupationsDied.slice(0, 5)}
            name={d => `${plural(d.occupation.occupation)} (${d.num_died})`}
            url={d => `/profile/occupation/${d.occupation.occupation_slug}`}
          />
          .
        </p>
      </div>
      {occupationsBorn.length ? (
        <OccupationsTmap
          attrs={attrs}
          data={tmapBornData}
          title={`Occupations of People Born during the ${era.name}`}
        />
      ) : null}
      {occupationsDied.length ? (
        <OccupationsTmap
          attrs={attrs}
          data={tmapDeathData}
          title={`Occupations of People Deceased during the ${era.name}`}
        />
      ) : null}
    </SectionLayout>
  );
}
