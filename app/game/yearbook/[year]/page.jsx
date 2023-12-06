import Link from "next/link";
import { FORMATTERS } from "../../../../components/utils/consts";
import YearbookSidebar from "../../../../components/games/YearbookSidebar";
import "../../../../components/games/Yearbook.css";

async function getPeopleBornInYear(year) {
  const res = await fetch(
    `https://api.pantheon.world/person?select=name,l,l_,age,non_en_page_views,coefficient_of_variation,hpi,id,slug,gender,birthyear,deathyear,bplace_country(id,country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,occupation_slug)&birthyear=eq.${year}&hpi=gte.4&order=hpi.desc.nullslast`
  );
  return res.json();
}

export default async function Page({ params: { year } }) {
  const peopleBornInYear = await getPeopleBornInYear(year);

  const topPersonM = peopleBornInYear.find((d) => d.gender === "M");
  const topPersonF = peopleBornInYear.find((d) => d.gender === "F");

  return (
    <div className="yearbook-page">
      <YearbookSidebar year={year} />
      <div className="yearbook-page">
        <div className="yearbook">
          <div className="section long-text">
            <h1>Pantheon {year} Yearbook</h1>
            <div className="portrait-container-parent">
              <div className="portrait-container">
                <div className="portrait-desc">
                  <h2>
                    <Link href={`/profile/person/${topPersonF.slug}`}>
                      {topPersonF.name}
                    </Link>
                  </h2>
                </div>
                <div className="portrait">
                  <img src={`/images/profile/people/${topPersonF.id}.jpg`} />
                  <div className="shadow"></div>
                </div>
              </div>
              <div className="portrait-container">
                <div className="portrait">
                  <img src={`/images/profile/people/${topPersonM.id}.jpg`} />
                  <div className="shadow"></div>
                </div>
                <div className="portrait-desc">
                  <h2>
                    <Link href={`/profile/person/${topPersonM.slug}`}>
                      {topPersonM.name}
                    </Link>
                  </h2>
                </div>
              </div>
            </div>

            <section className="top-grid">
              {peopleBornInYear.slice(0, 100).map((person, i) => (
                <div key={person.id}>
                  <Link
                    href={`/profile/person/${person.slug}`}
                    className="grid-portrait-container"
                  >
                    <img
                      src={`/images/profile/people/${person.id}.jpg`}
                      // onError={(evt) => (evt.target.style.display = "none")}
                    />
                  </Link>
                  <span>
                    {i + 1}.{" "}
                    <Link href={`/profile/person/${person.slug}`}>
                      {person.name}
                    </Link>
                    <table>
                      <tbody>
                        <tr>
                          <td colSpan="2">
                            {person.occupation
                              ? person.occupation.occupation
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <th>HPI</th>
                          <td>{FORMATTERS.decimal(person.hpi)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
