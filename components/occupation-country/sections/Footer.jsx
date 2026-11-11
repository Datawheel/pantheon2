import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {
  cap,
  englishCountry,
  fixFromCountry,
  formatNumber,
  getOcStrings,
  occupationPluralFor,
} from "@/app/occupationCountryTranslations";
import "../../common/Footer.css";
import "./OccupationCountry.css";

const CARDS = 3;
const CJK = new Set(["ja", "zh"]);
const LINKS = 12;

// "Keep exploring": the same occupation in other countries and other
// occupations in this country. Image cards for the first few, then plain
// text links so every sibling page gets a crawlable, descriptive link.
export default function Footer({data, names, locale = DEFAULT_LOCALE}) {
  const {occupation, country, standings, occupationsInCountry} = data;
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const occSlug = occupation.occupation_slug;

  const otherCountries = standings
    .filter(row => row.country !== country.id)
    .map(row => {
      const cd = row.country_data || {};
      const name = cd[`${locale}_country`] || cd.country || row.country;
      // Japanese/Chinese read better as "サッカー選手 / 日本" than with the
      // DB's "日本から"; everything else uses the localized "from" phrase.
      const from = locale === "en"
        ? `from ${englishCountry(cd.country || row.country)}`
        : CJK.has(locale)
          ? name
          : fixFromCountry(cd[`${locale}_from_country`], locale) || `${s.from} ${name}`;
      return {
        key: row.country,
        slug: cd.slug || row.country_slug,
        name,
        from,
        count: row.num_people,
      };
    });

  const otherOccupations = occupationsInCountry.map(row => {
    const od = row.occupation_data || {};
    const slug = od.occupation_slug || row.occupation_slug;
    return {
      key: row.occupation,
      slug,
      name: occupationPluralFor(slug, od[`${locale}_occupation`] || od.occupation, locale),
      count: row.num_people,
    };
  });

  if (!otherCountries.length && !otherOccupations.length) return null;
  const occupationTitle = cap(names.occPluralTitle);

  const cards = [
    ...otherCountries.slice(0, CARDS).map(c => ({
      key: `c-${c.key}`,
      href: `${localePrefix}/profile/occupation/${occSlug}/country/${c.slug}`,
      image: `https://static.pantheon.world/profile/country/${c.slug}.jpg`,
      title: occupationTitle,
      subtitle: c.from,
    })),
    ...otherOccupations.slice(0, CARDS).map(o => ({
      key: `o-${o.key}`,
      href: `${localePrefix}/profile/occupation/${o.slug}/country/${country.slug}`,
      image: `https://static.pantheon.world/profile/occupation/${o.slug}.jpg`,
      title: o.name,
      subtitle: CJK.has(locale) ? names.country : names.fromCountry,
    })),
  ];

  return (
    <footer className="profile-footer oc-related">
      <div className="footer-container">
        <h2 className="footer-title">
          {t.occupationCountry?.keepExploring || s.keepExploring || tEn.occupationCountry.keepExploring}
        </h2>
        <ul className="footer-carousel-container">
          {cards.map(card => (
            <li className="footer-carousel-item" key={card.key}>
              <div className="footer-carousel-item-photo">
                <a
                  href={card.href}
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{backgroundImage: `url(${card.image})`}}
                ></a>
              </div>
              <h3 className="footer-carousel-item-title">
                <a href={card.href}>{card.title}</a>
              </h3>
              <p>{card.subtitle}</p>
            </li>
          ))}
        </ul>

        <div className="oc-related-columns">
          {otherCountries.length > CARDS && (
            <nav className="oc-related-col" aria-label={s.relatedSameOcc(names)}>
              <h3>{cap(s.relatedSameOcc(names))}</h3>
              <ul>
                {otherCountries.slice(CARDS, CARDS + LINKS).map(c => (
                  <li key={c.key}>
                    <a href={`${localePrefix}/profile/occupation/${occSlug}/country/${c.slug}`}>
                      {c.name}
                    </a>
                    <span>{formatNumber(c.count, locale)}</span>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {otherOccupations.length > CARDS && (
            <nav className="oc-related-col" aria-label={s.relatedSameCountry(names)}>
              <h3>{cap(s.relatedSameCountry(names))}</h3>
              <ul>
                {otherOccupations.slice(CARDS, CARDS + LINKS).map(o => (
                  <li key={o.key}>
                    <a href={`${localePrefix}/profile/occupation/${o.slug}/country/${country.slug}`}>
                      {o.name}
                    </a>
                    <span>{formatNumber(o.count, locale)}</span>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
