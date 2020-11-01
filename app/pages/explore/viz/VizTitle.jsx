import React from "react";
import {connect} from "react-redux";
import {merge} from "d3-array";
import {plural} from "pluralize";

const VizTitle = ({city, country, gender, loading, nestedOccupations, places, occupation, show, yearType, placeType}) => {
  let occupationSubject = "";
  let fromLocation = "";
  let thisOcc;
  let genderedPronoun = "people";

  // Gender ---
  if (gender === "F" || gender === "M") {
    genderedPronoun = gender === true ? "men" : "women";
  }

  // Occupations ---
  if (occupation === "all") {
    occupationSubject = genderedPronoun;
  }
  else {
    if (occupation.includes(",")) {
      thisOcc = nestedOccupations.map(no => no.domain).find(no => no.id === occupation).name;
      occupationSubject = `${genderedPronoun} in ${thisOcc.toLowerCase()} occupations`;
      // occupationSubject = `${genderedPronoun} in ${occupation.toLowerCase()} occupations`;
    }
    else {
      const gendersLookup = {people: "", men: "male", women: "female"};
      // thisOcc = merge(nestedOccupations.map(no => no.occupations)).find(no => `${no.id}` === occupation).occupation;
      occupationSubject = `${gendersLookup[genderedPronoun]} ${plural(occupation.toLowerCase())}`;
    }
  }

  const bornOrDeceased = yearType === "deathyear" || placeType === "deathplace" ? "deceased" : "born";

  // Locations ---
  if (country !== "all" && places) {
    const countryObj = places.map(p => p.country).find(c => `${c.country_code}` === country);
    if (countryObj) {
      if (city !== "all") {
        const cityObj = merge(places.map(p => p.cities)).find(c => `${c.id}` === city);
        fromLocation = ` born in ${cityObj.place}, ${countryObj.country}`;
      }
      else {
        fromLocation = ` ${bornOrDeceased} in present day ${countryObj.country}`;
      }
    }
  }

  let title = `Memorable ${occupationSubject}${fromLocation}`;
  if (show === "occupations") {
    title = `Occupations of memorable ${occupationSubject}${fromLocation}`;
  }
  if (show === "places") {
    title = `Places of memorable ${occupationSubject}${fromLocation}`;
  }

  return !loading
    ? <h1 className="explore-title">
      {title}
    </h1>
    : null;
};

const mapStateToProps = state => ({
  data: state.vb.data,
  city: state.vb.city,
  country: state.vb.country,
  gender: state.vb.gender,
  nestedOccupations: state.data.occupationResponse.nestedOccupations,
  occupation: state.vb.occupation,
  show: state.vb.show,
  yearType: state.vb.yearType,
  places: state.data.places,
  placeType: state.vb.placeType
});

export default connect(mapStateToProps)(VizTitle);
