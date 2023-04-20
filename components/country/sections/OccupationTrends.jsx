import { nest } from "d3-collection";
import { plural } from "pluralize";
import AnchorList from "../../utils/AnchorList";
import SectionLayout from "../../common/SectionLayout";
import { calculateYearBucket } from "../../utils/vizHelpers";
import OccupationsStackedArea from "../../place/sections/vizes/OccupationsStackedArea";

const OccupationTrends = ({
  attrs,
  country,
  peopleBorn,
  peopleDied,
  occupations,
  slug,
  title,
}) => {
  const currentYear = new Date().getFullYear();
  const topModern = nest()
    .key((d) => d.occupation.id)
    .sortValues((a, b) => b.langs - a.langs)
    .entries(
      peopleBorn.filter(
        (d) => d.birthyear >= currentYear - 100 && d.occupation !== null
      )
    )
    .sort((a, b) => b.values.length - a.values.length);
  const topOverall = nest()
    .key((d) => d.occupation.id)
    .sortValues((a, b) => b.langs - a.langs)
    .entries(peopleBorn.filter((d) => d.occupation !== null))
    .sort((a, b) => b.values.length - a.values.length);
  const occupationsLookup = occupations.reduce((obj, item) => {
    obj[`${item.id}`] = item;
    return obj;
  }, {});

  const tmapBornData = peopleBorn
    .filter((p) => p.birthyear !== null && p.occupation !== null)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach((d) => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.bplace_geonameid;
  });

  const tmapDeathData = peopleDied
    .filter((p) => p.deathyear !== null && p.occupation !== null)
    .sort((a, b) => b.langs - a.langs);

  tmapDeathData.forEach((d) => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.dplace_geonameid;
  });

  const [bornBuckets, bornTicks] = calculateYearBucket(
    tmapBornData,
    (d) => d.birthyear
  );
  const [deathBuckets, deathTicks] = calculateYearBucket(
    peopleDied,
    (d) => d.deathyear
  );

  if (!topOverall.length && !topModern.length) {
    return null;
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="section-body">
        <div>
          {topModern.length ? (
            <p>
              Over the past 100 years,{" "}
              <a
                href={`/profile/occupation/${
                  occupationsLookup[topModern[0].key].occupation_slug
                }`}
              >
                {plural(
                  occupationsLookup[topModern[0].key].occupation.toLowerCase()
                )}
              </a>{" "}
              have been the top profession of globally memorable people born in
              present day {country.country}, including{" "}
              <AnchorList
                items={topModern[0].values.slice(0, 3)}
                name={(d) => d.name}
                url={(d) => `/profile/person/${d.slug}`}
              />
              . Whereas, throughout history,{" "}
              <a
                href={`/profile/occupation/${
                  occupationsLookup[topOverall[0].key].occupation_slug
                }`}
              >
                {plural(
                  occupationsLookup[topOverall[0].key].occupation.toLowerCase()
                )}
              </a>{" "}
              have been the profession with the most memorable people born in
              present day {country.country}, including{" "}
              <AnchorList
                items={topOverall[0].values.slice(0, 3)}
                name={(d) => d.name}
                url={(d) => `/profile/person/${d.slug}`}
              />
              .
            </p>
          ) : (
            <p>
              Throughout history{" "}
              <a
                href={`/profile/occupation/${
                  occupationsLookup[topOverall[0].key].occupation_slug
                }`}
              >
                {plural(
                  occupationsLookup[topOverall[0].key].occupation.toLowerCase()
                )}
              </a>{" "}
              have been the profession with the most memorable people born in
              present day {country.country}, including{" "}
              <AnchorList
                items={topOverall[0].values.slice(0, 3)}
                name={(d) => d.name}
                url={(d) => `/profile/person/${d.slug}`}
              />
              .
            </p>
          )}
        </div>
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
        {/* <VizWrapper component={this} refKey="viz">
        <StackedArea
          key="stacked1"
          config={{
            title: "Births Over Time",
            data: tmapBornData,
            depth: 2,
            groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
            shapeConfig: shapeConfig(attrs),
            tooltipConfig: groupTooltip(tmapBornData),
            xConfig: {
              labels: bornTicks,
              tickFormat: d => bornBuckets[d]
            }
          }} />
      </VizWrapper>
      <VizWrapper component={this} refKey="viz2">
        <StackedArea
          key="stacked2"
          config={{
            title: "Deaths Over Time",
            data: tmapDeathData,
            depth: 2,
            groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
            shapeConfig: shapeConfig(attrs),
            tooltipConfig: groupTooltip(tmapDeathData),
            xConfig: {
              labels: deathTicks,
              tickFormat: d => deathBuckets[d]
            }
          }} />
      </VizWrapper> */}
      </div>
    </SectionLayout>
  );
};

export default OccupationTrends;
