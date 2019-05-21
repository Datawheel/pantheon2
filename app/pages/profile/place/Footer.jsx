import React from "react";
import pluralize from "pluralize";
import {sum as D3Sum} from "d3-array";
import {nest} from "d3-collection";
import "pages/profile/common/Footer.css";

const Footer = ({occupations, peopleBornHere, peopleDiedHere}) => {
  // calculate RCAs for this location
  const totalNumBorn = D3Sum(occupations, o => o.num_born);
  const occupationShares = occupations.reduce((obj, d) => {
    obj[`${d.id}`] = d.num_born / totalNumBorn;
    return obj;
  }, {});

  const allPeople = peopleBornHere.filter(d => d.occupation).concat(peopleDiedHere.filter(d => d.occupation));
  const uniqIds = {};
  const uniqPeople = allPeople.filter(obj => !uniqIds[obj.id] && (uniqIds[obj.id] = true));

  if (!uniqPeople.length) {
    return <footer className="profile-footer">
      <div className="footer-container"></div>
    </footer>;
  }

  const occupationRcas = nest()
    .key(d => d.occupation_id)
    .rollup(leaves => ({
      numBorn: leaves.length,
      rca: leaves.length / uniqPeople.length / occupationShares[leaves[0].occupation_id],
      occupation: leaves[0].occupation
    }))
    .entries(uniqPeople)
    .map(d => d.value)
    .sort((a, b) => b.rca - a.rca);


  // top people overall
  const topBornHere = peopleBornHere.filter(person => person.occupation).length ? peopleBornHere.filter(person => person.occupation)[0] : null;
  // 2nd person try to have a woman
  let topBornHere2 = peopleBornHere.filter(person => person.occupation && person.gender === "F").length ? peopleBornHere.filter(person => person.occupation && person.gender === "F")[0] : null;
  if (!topBornHere2) {
    topBornHere2 = peopleBornHere.filter(person => person.occupation).length > 1 ? peopleBornHere.filter(person => person.occupation)[1] : null;
  }

  const topDiedHere = peopleDiedHere.filter(person => ![topBornHere, topBornHere2].filter(Boolean).map(x => x.id).includes(person.id) && person.occupation).length ? peopleDiedHere.filter(person => ![topBornHere, topBornHere2].filter(Boolean).map(x => x.id).includes(person.id) && person.occupation)[0] : null;
  // 2nd person try to have a woman
  let topDiedHere2 = peopleDiedHere.filter(person => person.gender === "F" && ![topBornHere, topBornHere2].filter(Boolean).map(x => x.id).includes(person.id) && person.occupation).length ? peopleDiedHere.filter(person => !person.gender && ![topBornHere, topBornHere2].filter(Boolean).map(x => x.id).includes(person.id) && person.occupation)[0] : null;
  if (!topDiedHere2) {
    topDiedHere2 = peopleDiedHere.filter(person => ![topBornHere, topBornHere2].filter(Boolean).map(x => x.id).includes(person.id) && person.occupation).length > 1 ? peopleDiedHere.filter(person => person.gender && ![topBornHere, topBornHere2].filter(Boolean).map(x => x.id).includes(person.id) && person.occupation)[1] : null;
  }

  const topPeople = [topBornHere, topBornHere2, topDiedHere, topDiedHere2];
  // top 2 occupaitons by RCA
  const topItems = occupationRcas.slice(0, 2).concat(topPeople).filter(Boolean);

  return <footer className="profile-footer">
    <div className="footer-container">
      <h4 className="footer-title">Keep Exploring</h4>
      <ul className="footer-carousel-container">
        {topItems.map(item =>
          <li className="footer-carousel-item" key={item.rca ? item.occupation.occupation_slug : item.id}>
            <div className="footer-carousel-item-photo">
              {item.rca
                ? <a href={`/profile/occupation/${item.occupation.occupation_slug}`} style={{backgroundImage: `url(/images/profile/occupation/${item.occupation.occupation_slug}.jpg)`}}></a>
                : <a href={`/profile/person/${item.slug}`} style={{backgroundImage: `url(/images/profile/people/${item.id}.jpg)`}}></a>}
            </div>
            <h4 className="footer-carousel-item-title">
              <a href={item.rca ? `/profile/occupation/${item.occupation.occupation_slug}/` : `/profile/person/${item.slug}/`}>{item.rca ? item.occupation.occupation : item.name}</a>
            </h4>
            <p>{item.rca ? `${pluralize("individual", item.numBorn, true)}` : item.occupation.occupation}</p>
          </li>
        )}
      </ul>
    </div>
  </footer>;
};

export default Footer;
