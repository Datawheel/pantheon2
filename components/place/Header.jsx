import {max as d3Max, min as d3Min} from "d3-array";
import dayjs from "dayjs";
import {DEFAULT_LOCALE} from "@/app/locales";
import "../../styles/Header.css";
import "../../styles/mouse.css";

export default function Header({
  place,
  country,
  wikiSummary,
  wikiPageViews,
  lang = "en",
}) {
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const wikiPageViewItems = wikiPageViews?.items || null;

  let pageViewData = null;
  if (wikiPageViewItems) {
    pageViewData = wikiPageViewItems.map(pv => ({
      ...pv,
      date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(
        4,
        6,
      )}/${pv.timestamp.substring(6, 8)}`,
    }));
    const mostRecentDate = d3Max(pageViewData, d =>
      dayjs(d.date, "YYYY/MM/DD"),
    );
    const oldestDate = d3Min(pageViewData, d => dayjs(d.date, "YYYY/MM/DD"));
    pageViewData.push({
      ...pageViewData.find(d => d.date === oldestDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
    pageViewData.push({
      ...pageViewData.find(d => d.date === mostRecentDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
  }

  let placeImg = place.img_link
    ? `https://static.pantheon.world/profile/place/${place.id}.jpg`
    : country && country.img_link
      ? `https://static.pantheon.world/profile/country/${country.slug}.jpg`
      : "https://static.pantheon.world/profile/placeholder_place_profile.jpg";

  if (wikiSummary?.originalimage) {
    placeImg = wikiSummary.originalimage.source;
  }
  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask place">
          <div
            className="bg-img bg-img-t"
            style={{backgroundImage: `url(${placeImg})`}}
          ></div>
          <div
            className="bg-img bg-img-b"
            style={{backgroundImage: `url(${placeImg})`}}
          ></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production in</p>
        <h2 className="profile-type">Present Day</h2>

        {country && country.country_code ? (
          <h1 className="profile-name">
            {place.place} ({country.country_code})
          </h1>
        ) : (
          <h1 className="profile-name">{place.place}</h1>
        )}

        {country ? (
          <p className="date-subtitle">
            <a href={`${localePrefix}/profile/country/${country.slug}`}>
              {country.country}
            </a>
          </p>
        ) : null}
        {/* <p className="date-subtitle">{ FORMATTERS.year(country.soverign_date) === 0 ? "1AD" : FORMATTERS.year(country.soverign_date) } - Today</p> */}
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
