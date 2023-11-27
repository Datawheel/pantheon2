import { nest } from "d3-collection";
import Explore from "../../../features/Explore";

async function getPlaces() {
  const res = await fetch(
    "https://api.pantheon.world/place?select=id,place,lat,lon,slug,country:country_fk(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died"
  );
  return res.json();
}

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast"
  );
  return res.json();
}

export default async function Page() {
  let [places, occupations] = await Promise.all([
    getPlaces(),
    getOccupations(),
  ]);
  places = nest()
    .key((d) => d.country_id)
    .entries(places)
    .map((countryData) => ({
      country: countryData.values[0].country,
      cities: countryData.values,
    }))
    .filter((countryData) => countryData.country);
  const nestedOccupations = nest()
    .key((d) => d.domain_slug)
    .entries(occupations)
    .map((occData) => ({
      domain: {
        id: `${occData.values.map((o) => o.id)}`,
        slug: occData.values[0].domain_slug,
        name: occData.values[0].domain,
      },
      occupations: occData.values,
    }));

  return (
    <div className="explore">
      {/* <Helmet title="Rankings" /> */}
      <Explore
        places={places}
        nestedOccupations={nestedOccupations}
        pageType="rankings"
      />
      {/* <div className="explore-head"> */}
      {/* <VizTitle /> */}
      {/* {years.length ? (
            <h3 className="explore-date">
              {FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}
            </h3>
          ) : null}
          {metricSentence ? <p>{metricSentence}</p> : null} */}
      {/* </div> */}
      <div className="explore-body">
        {/* <Controls
            countryLookup={this.countryLookup}
            updateData={this.updateData}
            update={this.update}
            nestedOccupations={nestedOccupations}
            pageType={pageType}
            places={places}
            pathname={pathname}
            qParams={qParams}
          />
          {rankingData.data ? <RankingTable /> : <Spinner />} */}
      </div>
    </div>
  );
}
