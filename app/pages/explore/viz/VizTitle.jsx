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
      occupationSubject = `${genderedPronoun} in ${thisOcc.toLowerCase()} occupations`;
    }
    else {
      const gendersLookup = {people: "", men: "male", women: "female"};
      thisOcc = merge(nestedOccupations.map(no => no.occupations)).find(no => `${no.id}` === occupation).occupation;
      occupationSubject = `${gendersLookup[genderedPronoun]} ${plural(thisOcc.toLowerCase())}`;
    }
  }

  const bornOrDeceased = yearType === "birthyear" ? "born" : "deceased";

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

export default VizTitle;
