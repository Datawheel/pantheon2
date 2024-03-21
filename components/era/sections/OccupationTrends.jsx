import SectionLayout from "../../common/SectionLayout";
import {calculateYearBucket} from "../../utils/vizHelpers";
import OccupationsStackedArea from "../../place/sections/vizes/OccupationsStackedArea";

const OccupationTrends = ({attrs, peopleBorn, peopleDied, slug, title}) => {
  const tmapBornData = peopleBorn
    .filter(
      p => p.birthyear !== null && p.bplace_country !== null && p.occupation
    )
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.borncountry = d.bplace_country.country;
    d.borncontinent = d.bplace_country.continent;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
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
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.deathplace;
  });

  const [bornBuckets, bornTicks] = calculateYearBucket(
    tmapBornData,
    d => d.birthyear
  );
  const [deathBuckets, deathTicks] = calculateYearBucket(
    tmapDeathData,
    d => d.deathyear
  );

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="section-body">
        <OccupationsStackedArea
          attrs={attrs}
          title="Births Over Time"
          data={tmapBornData}
          ticks={bornTicks}
          buckets={bornBuckets}
        />
        {tmapDeathData.length ? (
          <OccupationsStackedArea
            attrs={attrs}
            title="Deaths Over Time"
            data={tmapDeathData}
            ticks={deathTicks}
            buckets={deathBuckets}
          />
        ) : null}
      </div>
    </SectionLayout>
  );
};

export default OccupationTrends;
