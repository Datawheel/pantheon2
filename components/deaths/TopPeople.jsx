import PeopleGrid from "/components/deaths/PeopleGrid";
import "../common/Section.css";
import AnchorList from "../utils/AnchorList";
import {plural} from "pluralize";
import {toTitleCase} from "../utils/vizHelpers";

export default async function TopPeople({occupation, year, people}) {
  const peopleSortedByHPI = people.sort((a, b) => b.hpi - a.hpi);
  const topActors = peopleSortedByHPI.filter(p =>
    ["ACTOR"].includes(p.occupation?.occupation)
  );
  const topMusicians = peopleSortedByHPI.filter(p =>
    ["MUSICIAN", "SINGER"].includes(p.occupation?.occupation)
  );
  const topAthletes = peopleSortedByHPI.filter(
    p => p.occupation?.domain === "SPORTS"
  );
  const typeOfCeleb = occupation
    ? plural(occupation.occupation.toLowerCase())
    : "celebrities";
  return (
    <section className="profile-section">
      {occupation ? (
        <h2>
          {year} Deaths: Honoring Lives and Legacies of{" "}
          {plural(toTitleCase(occupation.occupation))}
        </h2>
      ) : (
        <h2>{year} Deaths: Honoring Lives and Legacies</h2>
      )}
      <div className="section-body">
        <p>
          The year {year} saw the passing of many beloved {typeOfCeleb}, leaving
          behind legacies that continue to inspire fans across the globe. From
          legendary actors like{" "}
          <AnchorList
            items={topActors.slice(0, 3)}
            name={d => d.name}
            url={d => `/profile/person/${d.slug}/`}
          />{" "}
          and iconic musicians like{" "}
          <AnchorList
            items={topMusicians.slice(0, 3)}
            name={d => d.name}
            url={d => `/profile/person/${d.slug}/`}
          />{" "}
          to groundbreaking athletes like{" "}
          <AnchorList
            items={topAthletes.slice(0, 3)}
            name={d => d.name}
            url={d => `/profile/person/${d.slug}/`}
          />
          , these remarkable individuals have made a lasting impact in their
          fields. This page is dedicated to commemorating the lives of those we
          lost in {year}, celebrating their achievements and remembering their
          contributions to art, culture, and history. Below are the list of the
          most famous people to have died in {year} based on cultural impact.
        </p>
      </div>

      <PeopleGrid
        bios={peopleSortedByHPI.slice(0, 16)}
        occupation={occupation}
        year={year}
      />
    </section>
  );
}
