import React from "react";
import {nest} from "d3-collection";
import {StackedArea} from "d3plus-react";
import {plural} from "pluralize";
import {FORMATTERS} from "types";
import AnchorList from "components/utils/AnchorList";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {calculateYearBucket, groupTooltip, on} from "viz/helpers";
import {COLORS_CONTINENT} from "types";

const PlacesTime = ({eras, people, occupation}) => {
  people = people
    .filter(p => p.birthyear)
    .sort((a, b) => b.birthyear - a.birthyear);
  people.forEach(p => {
    const thisEra = eras.filter(e => p.birthyear >= e.start_year && p.birthyear <= e.end_year);
    p.era = thisEra.length ? thisEra[0].id : null;
  });
  const oldestPeople = people.slice(Math.max(people.length - 3, 1));

  const peopleByEra = nest()
    .key(p => p.era)
    .entries(people.filter(p => p.era))
    .sort((a, b) => b.values.length - a.values.length);
  const eraWithMostPeople = eras.filter(e => e.id.toString() === peopleByEra[0].key)[0];

  const tmapBornData = people
    .filter(p => p.birthyear !== null && p.bplace_country && p.bplace_country.country && p.bplace_country.continent)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.borncountry = d.bplace_country.country;
    d.borncontinent = d.bplace_country.continent;
  });

  const tmapDeathData = people
    .filter(p => p.deathyear !== null && p.deathcountry && p.deathcountry.country && p.deathcountry.continent)
    .sort((a, b) => b.langs - a.langs);

  tmapDeathData.forEach(d => {
    d.diedcountry = d.deathcountry.country_name;
    d.diedcontinent = d.deathcountry.continent;
  });

  const [bornBuckets, bornTicks] = calculateYearBucket(tmapBornData, d => d.birthyear);
  const [deathBuckets, deathTicks] = calculateYearBucket(tmapDeathData, d => d.deathyear);

  return (
    <section className="profile-section">
      <SectionHead title="Places Over Time" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            The first {plural(occupation.occupation)} in Pantheon are <AnchorList items={oldestPeople} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.&nbsp;
            The concentration of {plural(occupation.occupation)} was largest during the <a href={`/profile/era/${eraWithMostPeople.slug}`}>{eraWithMostPeople.name}</a>, which lasted from {FORMATTERS.year(eraWithMostPeople.start_year)} to {FORMATTERS.year(eraWithMostPeople.end_year)}.
            Some birth or death locations for earlier {plural(occupation.occupation)} are unknown, which may account for timeline differences below.
          </p>
        </div>
        <VizWrapper component={this} refKey="viz">
          <StackedArea
            key="stacked_country1"
            config={{
              title: `Birth Places of ${occupation.occupation}s Over Time`,
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              on: on("place", d => d.bplace_country.slug),
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              tooltipConfig: groupTooltip(tmapBornData, d => d.bplace_country.slug),
              xConfig: {
                labels: bornTicks,
                tickFormat: d => bornBuckets[d]
              }
            }} />
        </VizWrapper>
        {tmapDeathData.length > 1
          ? <VizWrapper component={this} refKey="viz2">
            <StackedArea
              key="stacked_country2"
              config={{
                title: `Death Places of ${occupation.occupation}s Over Time`,
                data: tmapDeathData,
                depth: 1,
                groupBy: ["diedcontinent", "diedcountry"],
                on: on("place", d => d.deathcountry.slug),
                shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
                tooltipConfig: groupTooltip(tmapDeathData, d => d.deathcountry.slug),
                xConfig: {
                  labels: deathTicks,
                  tickFormat: d => deathBuckets[d]
                }
              }} />
          </VizWrapper>
          : null}
      </div>
    </section>
  );
};

export default PlacesTime;
