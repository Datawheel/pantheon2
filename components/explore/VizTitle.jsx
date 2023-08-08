"use client";
import { useSelector } from "react-redux";
import { merge } from "d3-array";
import { plural } from "pluralize";

const lowerFirstLetter = (str) =>
  str.charAt(0).toLocaleLowerCase() + str.slice(1);

export default function VizTitle({ places, nestedOccupations }) {
  const {
    city,
    country,
    gender,
    occupation,
    page,
    placeType,
    show,
    viz,
    yearType,
  } = useSelector((state) => state.explore);

  let occupationSubject = "";
  let fromLocation = "";
  let thisOcc;
  let genderedPronoun = "people";

  // Gender ---
  if (gender === "F" || gender === "M") {
    genderedPronoun = gender === "M" ? "men" : "women";
  }

  // Occupations ---
  if (occupation === "all") {
    occupationSubject = genderedPronoun;
  } else {
    if (occupation.includes(",")) {
      thisOcc = nestedOccupations
        .map((no) => no.domain)
        .find((no) => no.id === occupation).name;
      occupationSubject = `${genderedPronoun} in ${thisOcc.toLowerCase()} occupations`;
      // occupationSubject = `${genderedPronoun} in ${occupation.toLowerCase()} occupations`;
    } else {
      const gendersLookup = { people: "", men: "male", women: "female" };
      // thisOcc = merge(nestedOccupations.map(no => no.occupations)).find(no => `${no.id}` === occupation).occupation;
      occupationSubject = `${gendersLookup[genderedPronoun]} ${plural(
        occupation.toLowerCase()
      )}`;
    }
  }

  const bornOrDeceased =
    yearType === "deathyear" || placeType === "deathplace"
      ? "deceased"
      : "born";

  // Locations ---
  if (country !== "all" && places) {
    const countryObj = places
      .map((p) => p.country)
      .find((c) => `${c.country_code}` === country);
    if (countryObj) {
      if (city !== "all") {
        const cityObj = merge(places.map((p) => p.cities)).find(
          (c) => `${c.id}` === city
        );
        fromLocation = ` born in ${cityObj.place}, ${countryObj.country}`;
      } else {
        fromLocation = ` ${bornOrDeceased} in present day ${countryObj.country}`;
      }
    }
  }

  let title = `Memorable ${occupationSubject}${fromLocation}`;
  if (show.type === "occupations") {
    title = `Occupations of memorable ${occupationSubject}${fromLocation}`;
  }
  if (show.type === "places") {
    const placeType =
      yearType === "deathyear" ? "Death places" : "Birth places";
    title = `${placeType} of memorable ${occupationSubject}${fromLocation}`;
  }

  let headTitle = `Ranking of ${lowerFirstLetter(title)}`;
  if (page === "viz") {
    let vizName = toTitleCase(viz);
    if (viz === "stackedarea") {
      vizName = "Stacked area chart";
    }
    if (viz === "linechart") {
      vizName = "Line chart";
    }
    headTitle = `${vizName} of ${lowerFirstLetter(title)}`;
  }

  return <h1 className="explore-title">{title}</h1>;
}
