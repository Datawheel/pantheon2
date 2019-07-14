import React from "react";
import {merge} from "d3-array";
import {plural} from "pluralize";

const VizTitle = ({city, country, gender, loading, nestedOccupations, places, occupation, show, yearType}) => {
  let occupationSubject = "";
  let fromLocation = "";
  let thisOcc;
  let genderedPronoun = "people";

  // Gender ---
  if (gender === true || gender === false) {
    genderedPronoun = gender === true ? "men" : "women";
  }

  // Occupations ---
  if (occupation === "all") {
    occupationSubject = genderedPronoun;
  }
  else if (nestedOccupations) {
    if (occupation.includes(",")) {
      thisOcc = nestedOccupations.map(no => no.domain).find(no => no.id === occupation).name;
      occupationSubject = `${genderedPronoun} in ${thisOcc} occupations`;
    }
    else {
      const gendersLookup = {people: "", men: "male", women: "female"};
      thisOcc = merge(nestedOccupations.map(no => no.occupations)).find(no => `${no.id}` === occupation).occupation;
      occupationSubject = `${gendersLookup[genderedPronoun]} ${plural(thisOcc)}`;
    }
  }

  // Locations ---
  if (country !== "all" && places) {
    const countryObj = places.map(p => p.country).find(c => `${c.country_code}` === country);
    if (countryObj) {
      if (city !== "all") {
        const cityObj = merge(places.map(p => p.cities)).find(c => `${c.id}` === city);
        fromLocation = ` from ${cityObj.place}, ${countryObj.country}`;
      }
      else {
        fromLocation = ` from ${countryObj.country}`;
      }
    }
  }

  const verb = yearType === "birthyear" ? "were" : "did";
  const predicate = yearType === "birthyear" ? "born" : "die";

  const title = show === "occupations"
    ? `What occupations were held by memorable ${occupationSubject}${fromLocation}?`
    : `Where ${verb} memorable ${occupationSubject}${fromLocation} ${predicate}?`;

  return !loading
    ? <h1 className="explore-title">
      {title}
    </h1>
    : null;
};

export default VizTitle;
