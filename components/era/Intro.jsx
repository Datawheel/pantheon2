import AnchorList from "../utils/AnchorList";
import {FORMATTERS} from "../utils/consts";
import {nest} from "d3-collection";
import "../common/Intro.css";

export default function Intro({era, eras, peopleBorn, peopleDied}) {
  const currentEraIndex = eras.findIndex(e => e.slug === era.slug);
  const prevEra = currentEraIndex > 0 ? eras[currentEraIndex - 1] : null;
  const nextEra =
    currentEraIndex < eras.length - 1 ? eras[currentEraIndex + 1] : null;
  let nextPrevSentence;
  if (prevEra && nextEra) {
    nextPrevSentence = (
      <span>
        This Era was preceded by the{" "}
        <a href={`/profile/era/${prevEra.slug}`}>{prevEra.name}</a> and followed
        by the <a href={`/profile/era/${nextEra.slug}`}>{nextEra.name}</a>.
      </span>
    );
  } else if (prevEra) {
    nextPrevSentence = (
      <span>
        This Era was preceded by the{" "}
        <a href={`/profile/era/${prevEra.slug}`}>{prevEra.name}</a>.
      </span>
    );
  } else if (nextEra) {
    nextPrevSentence = (
      <span>
        This Era was followed by the{" "}
        <a href={`/profile/era/${nextEra.slug}`}>{nextEra.name}</a>.
      </span>
    );
  }
  const cities = nest()
    .key(d => d.dplace_geonameid.id)
    .rollup(leaves => ({
      num_died: leaves.length,
      city: leaves[0].dplace_geonameid,
    }))
    .entries(peopleDied.filter(d => d.dplace_geonameid))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value);
  return (
    <section className="intro-section era">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" alt="Icon of era" />
          </h3>
          <p>
            The {era.name} took place between {FORMATTERS.year(era.start_year)}{" "}
            and {FORMATTERS.year(era.end_year)}. &nbsp;{nextPrevSentence}&nbsp;
            The most memorable people born in this era include{" "}
            <AnchorList
              items={peopleBorn.slice(0, 3)}
              name={d => `${d.name}`}
              url={d => `/profile/person/${d.slug}/`}
            />
            . The most important cities in this era, ranked by number of deaths,
            were{" "}
            <AnchorList
              items={cities.slice(0, 3)}
              name={d => `${d.city.place} (${d.num_died})`}
              url={d => `/profile/place/${d.city.slug}/`}
            />
            .
          </p>
        </div>
        <ul className="items era-timeline">
          {eras.map(e => (
            <li key={e.slug} className="item era-time">
              <a
                href={`/profile/era/${e.slug}`}
                className={
                  e.slug === era.slug
                    ? "item-link era-time-link active"
                    : "item-link era-time-link"
                }
              >
                {e.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
