import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import MemMetricsAreaPlot from "./MemMetricsAreaPlot";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";

async function getWikiPageViewsPast30Days(personId) {
  const res = await fetch(
    `https://pantheon.world/api/wikiTrendDetails?pid=${personId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );
  return res.json();
}

export default async function MemMetricx({pageViews, person, slug, title}) {
  const wikiPageViewsPast30Days = await getWikiPageViewsPast30Days(person.id);

  const isTrending = wikiPageViewsPast30Days && wikiPageViewsPast30Days.length;
  const domainColor =
    COLORS_DOMAIN[
      person?.occupation?.domain
        .toLowerCase()
        .replace("& ", "")
        .replace(/ /g, "-")
    ];
  const trendData = wikiPageViewsPast30Days.map((d, i) => ({
    ...d,
    index: i,
    color: domainColor,
  }));
  const totalPageviews = pageViews?.items
    ? pageViews?.items
        ?.filter(pv => pv.views)
        .map(pv => pv.views)
        .reduce((total, newVal) => total + newVal, 0)
    : 0;

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="metrics-container">
        <div className="metric-vid">
          {person?.youtube ? (
            <iframe
              src={`https://www.youtube.com/embed/${person?.youtube}`}
              max-width="560"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <button
              className="press-play"
              aria-label="Press to play video"
              disabled
              tabIndex="-1"
            >
              <i />
            </button>
          )}
        </div>
        {isTrending ? <MemMetricsAreaPlot trendData={trendData} /> : null}
        <ul className="metrics-list">
          <li className="metric">
            <h4>{FORMATTERS.bigNum(totalPageviews)}</h4>
            <p>Page Views (PV)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.hpi)}</h4>
            <p>Historical Popularity Index (HPI)</p>
          </li>
          <li className="metric">
            <h4>{person.l}</h4>
            <p>Languages Editions (L)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.l_)}</h4>
            <p>Effective Languages (L*)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.coefficient_of_variation)}</h4>
            <p>Coefficient of Variation (CV)</p>
          </li>
          {/* {isTrending
            ? <li className="metric">
              <h4>{FORMATTERS.decimal(slope)}</h4>
              <p>30 day pageview slope</p>
            </li>
            : null} */}
        </ul>
      </div>
    </SectionLayout>
  );
}
