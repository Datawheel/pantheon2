import {Suspense} from "react";
import HeaderLine from "./HeaderLine";
import {plural} from "pluralize";
import {min, histogram} from "d3-array";
import {ckmeans} from "d3plus-legend";
import {COLORS_DOMAIN} from "../utils/consts";
import "../../styles/Header.css";
import "../../styles/mouse.css";

export default function Header({occupation, people}) {
  const filteredBirthyears = people.filter(d => d.birthyear && d.birthyear >= 1500).map(d => d.birthyear);
  const uniqueValues = new Set(filteredBirthyears).size;

  // determine number of buckets based on count of filtered data
  let numBuckets = 20;
  if (uniqueValues < 40) {
    numBuckets = 10;
  }
  if (uniqueValues < 10) {
    numBuckets = Math.max(1, uniqueValues);
  }

  // create histogram using ckmeans
  const b2 = filteredBirthyears.length > 0 && numBuckets > 0
    ? histogram().thresholds(data =>
        ckmeans(data, numBuckets).map(l => min(l))
      )(filteredBirthyears)
    : [];

  // get max top 3 people to show in tooltip
  const lineChartDataFormat = b2.map(bin => {
    const topPeople = people
      .filter(p => (p.birthyear >= bin.x0 || 0) && (p.birthyear < bin.x1 || 0))
      .sort((a, b) => b.hpi - a.hpi)
      .slice(0, 3);
    return {
      y: bin.length,
      x: bin.x0 || 0,
      binName: `${bin.x0 || 0} - ${bin.x1 - 1 || 0}`,
      topPeople,
    };
  });

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {people.slice(0, 4).map(p => (
              <img
                key={p.id}
                src={`https://static.pantheon.world/profile/people/${p.id}.jpg`}
              />
            ))}
          </div>
          <div className="bg-img bg-img-b">
            {people.slice(5, 9).map(p => (
              <img
                key={p.id}
                src={`https://static.pantheon.world/profile/people/${p.id}.jpg`}
              />
            ))}
          </div>
          <div
            style={{backgroundColor: COLORS_DOMAIN[occupation.domain_slug]}}
            className="bg-img-mask-after"
          ></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">Occupation</h2>
        <h1 className="profile-name">{plural(occupation.occupation)}</h1>
        <pre>
          <Suspense fallback={<div>Loading...</div>}>
            {/* <HeaderLine data={lineChartDataFormat} /> */}
          </Suspense>
        </pre>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
