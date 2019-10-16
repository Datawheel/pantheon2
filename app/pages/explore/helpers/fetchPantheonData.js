import api from "apiConfig";
import dataFormatter from "pages/explore/helpers/dataFormatter";

const fetchPantheonData = (pageType, countryLookup, state, dataUpdateCallback) => {
  const {city, country, gender, metricCutoff, metricType, occupation, show, viz, years, yearType, placeType} = state;
  console.log("STATEEEEE", state);
  const selectFields = "name,l,l_,age,non_en_page_views,coefficient_of_variation,hpi,id,slug,gender,birthyear,deathyear,bplace_country(id,country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_country(id,country,slug),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,occupation_slug)";
  const apiHeaders = null;
  const sorting = "&order=hpi.desc.nullslast";

  let placeFilter = "";
  if (country !== "all") {
    const countryId = countryLookup[country] ? countryLookup[country].id : "";
    placeFilter = placeType === "birthplace" ? `&bplace_country=eq.${countryId}` : `&dplace_country=eq.${countryId}`;
    if (city !== "all") {
      placeFilter = placeType === "birthplace" ? `&bplace_geonameid=eq.${city}` : `&dplace_geonameid=eq.${city}`;
    }
  }

  let occupationFilter = "";
  if (occupation !== "all") {
    occupationFilter = `&occupation=in.(${occupation})`;
  }

  let genderFilter = "";
  if (`${gender}`.toUpperCase() === "M" || `${gender}`.toUpperCase() === "F") {
    genderFilter = `&gender=eq.${gender.toUpperCase()}`;
  }

  let metricFilter = "";
  if (metricType) {
    metricFilter = `&${metricType}=gte.${metricCutoff}`;
  }

  const dataUrl = `/person?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${genderFilter}${metricFilter}${sorting}`;
  console.log("[fetchData]: ", dataUrl);
  api.get(dataUrl, {headers: apiHeaders}).then(res => {
    const data = pageType === "rankings" ? dataFormatter(res.data, show, placeType) : res.data;
    dataUpdateCallback(Object.assign(state, {data, loading: false, show, viz}));
  });
};

export default fetchPantheonData;
