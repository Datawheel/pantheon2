import {plural} from "pluralize";
import {toTitleCase} from "../../utils/vizHelpers";
import "../../common/Footer.css";

export default function Footer({
  allCountriesInOccupation,
  allOccupationsInCountry,
}) {
  return (
    <footer className="profile-footer">
      <div className="footer-container">
        <h4 className="footer-title">Keep Exploring</h4>
        <ul className="footer-carousel-container">
          {allCountriesInOccupation.slice(0, 3).map(countryOccupation => (
            <li
              className="footer-carousel-item"
              key={countryOccupation.country}
            >
              <div className="footer-carousel-item-photo">
                <a
                  aria-label={`Top ${toTitleCase(
                    plural(countryOccupation.occupation)
                  )} from ${countryOccupation.country}`}
                  href={`/profile/occupation/${countryOccupation.occupation_slug}/country/${countryOccupation.country_slug}`}
                  style={{
                    backgroundImage: `url(/images/profile/country/${countryOccupation.country_slug}.jpg)`,
                  }}
                ></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a
                  href={`/profile/occupation/${countryOccupation.occupation_slug}/country/${countryOccupation.country_slug}`}
                >
                  Top {toTitleCase(plural(countryOccupation.occupation))}
                </a>
              </h4>
              <p>from {countryOccupation.country}</p>
            </li>
          ))}
          {allOccupationsInCountry.slice(0, 3).map(occupationCountry => (
            <li
              className="footer-carousel-item"
              key={occupationCountry.country}
            >
              <div className="footer-carousel-item-photo">
                <a
                  aria-label={`Top ${toTitleCase(
                    plural(occupationCountry.occupation)
                  )} from ${occupationCountry.country}`}
                  href={`/profile/occupation/${occupationCountry.occupation_slug}/country/${occupationCountry.country_slug}`}
                  style={{
                    backgroundImage: `url(/images/profile/occupation/${occupationCountry.occupation_slug}.jpg)`,
                  }}
                ></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a
                  href={`/profile/occupation/${occupationCountry.occupation_slug}/country/${occupationCountry.country_slug}`}
                >
                  Top {toTitleCase(plural(occupationCountry.occupation))}
                </a>
              </h4>
              <p>from {occupationCountry.country}</p>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
