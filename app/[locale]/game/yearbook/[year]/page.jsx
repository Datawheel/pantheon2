import Link from "next/link";
import {FORMATTERS} from "@/components/utils/consts";
import PersonImage from "@/components/utils/PersonImage";
import {toTitleCase} from "@/components/utils/vizHelpers";
import YearbookSidebar from "@/components/games/YearbookSidebar";
import "../../../../../components/games/Yearbook.css";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";

async function getPeopleBornInYear(year) {
  const res = await fetch(
    `${BASE_API}/person?select=name,id,slug,gender,birthyear,deathyear,bplace_country(id,country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,occupation_slug)&birthyear=eq.${year}`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleBornInYearHpi(year) {
  const res = await fetch(
    `${BASE_API}/person_ranks?birthyear=eq.${year}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views&hpi=gte.4`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

export default async function Page(props) {
  const params = await props.params;
  const {year} = params;
  const [peopleBornInYearAttrs, peopleBornInYearHpi] = await Promise.all([
    getPeopleBornInYear(year),
    getPeopleBornInYearHpi(year),
  ]);

  const peopleBornInYear = peopleBornInYearAttrs
    .map(person => {
      const hpiData = peopleBornInYearHpi.find(hpi => hpi.id === person.id);
      return {
        ...person,
        ...(hpiData || {}),
      };
    })
    .filter(person => person.hpi)
    .sort((personA, personB) => personB.hpi - personA.hpi);

  const topPersonM = peopleBornInYear.find(d => d.gender === "M");
  const topPersonF = peopleBornInYear.find(d => d.gender === "F");

  return (
    <div className="yearbook-page">
      <YearbookSidebar year={year} />
      <div className="yearbook-page">
        <div className="yearbook">
          <div className="section long-text">
            <h1>Pantheon {year} Yearbook</h1>
            <div className="portrait-container-parent">
              {topPersonF ? (
                <div className="portrait-container">
                  <div className="portrait-desc">
                    <h2>
                      <Link href={`/profile/person/${topPersonF.slug}`}>
                        {topPersonF.name}
                      </Link>
                    </h2>
                  </div>
                  <div className="portrait">
                    <PersonImage
                      person={topPersonF}
                      src={`/profile/people/${topPersonF.id}.jpg`}
                      alt={`Yearbook image of ${topPersonF.name}`}
                      wrap={false}
                    />
                    <div className="shadow"></div>
                  </div>
                </div>
              ) : null}
              {topPersonM ? (
                <div className="portrait-container">
                  <div className="portrait">
                    <PersonImage
                      person={topPersonM}
                      src={`/profile/people/${topPersonM.id}.jpg`}
                      alt={`Yearbook image of ${topPersonM.name}`}
                      wrap={false}
                    />
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
              ) : null}
            </div>

            <section className="top-grid">
              {peopleBornInYear.slice(0, 100).map((person, i) => (
                <div key={person.id}>
                  <Link
                    href={`/profile/person/${person.slug}`}
                    className="grid-portrait-container"
                  >
                    <PersonImage
                      person={person}
                      src={`/profile/people/${person.id}.jpg`}
                      alt={person.name || ""}
                      wrap={false}
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
                              ? toTitleCase(person.occupation.occupation)
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            {person.bplace_country
                              ? person.bplace_country.country
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
