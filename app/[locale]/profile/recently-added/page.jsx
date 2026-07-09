import Link from "next/link";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {buildCanonical, buildLanguageAlternates} from "@/app/utils/hreflang";
import PersonImage from "@/components/utils/PersonImage";
import {toTitleCase} from "@/components/utils/vizHelpers";
import "@/components/recently-added/RecentlyAdded.css";

const PAGE_SIZE = 48;
const PERSON_FALLBACK = "https://static.pantheon.world/icons/icon-person.svg";

function parsePage(value) {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

async function getRecentlyAdded(page, locale) {
  const offset = (page - 1) * PAGE_SIZE;
  const url = `${BASE_API}/person_hpi?select=created_at,person:person_id(id,name,translations,slug,birthyear,deathyear,gender,occupation(occupation,occupation_slug,translations))&order=created_at.desc&limit=${PAGE_SIZE + 1}&offset=${offset}`;

  try {
    const response = await fetch(url, {
      next: {revalidate: REVALIDATE_PERIODS.SHORT},
    });

    if (!response.ok) {
      console.error(`[recently-added] HTTP ${response.status} for ${url}`);
      return {people: [], hasNext: false};
    }

    const json = await response.json();
    const rows = Array.isArray(json) ? json : [];
    const people = rows
      .filter(row => row.person?.slug)
      .map(row => {
        const person = row.person;
        const occupation = person.occupation;
        return {
          ...person,
          name: person.translations?.[locale] || person.name,
          occupationLabel:
            occupation?.translations?.[locale]?.occupation || occupation?.occupation,
          createdAt: row.created_at,
        };
      });

    return {people: people.slice(0, PAGE_SIZE), hasNext: people.length > PAGE_SIZE};
  } catch (error) {
    console.error("[recently-added] Failed to fetch people:", error);
    return {people: [], hasNext: false};
  }
}

export async function generateMetadata(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale)
    ? params.locale
    : DEFAULT_LOCALE;
  const t = getTranslations(locale).recentlyAdded;

  return {
    title: `${t.title} | Pantheon`,
    description: t.subtitle,
    openGraph: {
      title: `${t.title} | Pantheon`,
      description: t.subtitle,
      type: "website",
    },
    alternates: {
      canonical: buildCanonical(locale, "/profile/recently-added"),
      languages: buildLanguageAlternates("/profile/recently-added"),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = SUPPORTED_LOCALES.includes(params.locale)
    ? params.locale
    : DEFAULT_LOCALE;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const t = getTranslations(locale).recentlyAdded;
  const page = parsePage(searchParams?.page);
  const {people, hasNext} = await getRecentlyAdded(page, locale);
  const pagePath = `${localePrefix}/profile/recently-added`;

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });

  return (
    <div className="recently-added-page">
      <section className="recently-added-hero">
        <div className="recently-added-container">
          <p className="recently-added-eyebrow">Pantheon</p>
          <h1>{t.title}</h1>
          <p className="recently-added-subtitle">{t.subtitle}</p>
        </div>
      </section>

      <section className="recently-added-content">
        <div className="recently-added-container">
          {people.length > 0 ? (
            <div className="recently-added-grid">
              {people.map(person => {
                const formattedDate = person.createdAt
                  ? dateFormatter.format(new Date(person.createdAt))
                  : null;
                return (
                  <Link
                    key={person.id}
                    href={`${localePrefix}/profile/person/${person.slug}`}
                    className="recently-added-card"
                  >
                    <div className="recently-added-image">
                      <PersonImage
                        person={person}
                        src={`/profile/people/${person.id}.jpg`}
                        alt={person.name}
                        fallbackSrc={PERSON_FALLBACK}
                      />
                    </div>
                    <div className="recently-added-info">
                      <h2>{person.name}</h2>
                      <p className="recently-added-meta">
                        {person.occupationLabel
                          ? locale === DEFAULT_LOCALE
                            ? toTitleCase(person.occupationLabel.toLowerCase())
                            : person.occupationLabel
                          : null}
                        {person.birthyear
                          ? ` · ${person.birthyear}${person.deathyear ? `–${person.deathyear}` : ""}`
                          : null}
                      </p>
                      {formattedDate ? (
                        <time dateTime={person.createdAt}>
                          {t.addedOn({date: formattedDate})}
                        </time>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="recently-added-empty">{t.empty}</p>
          )}

          {page > 1 || hasNext ? (
            <nav className="recently-added-pagination" aria-label={t.pageLabel({page})}>
              {page > 1 ? (
                <Link href={`${pagePath}?page=${page - 1}`}>{t.previous}</Link>
              ) : <span />}
              <span>{t.pageLabel({page})}</span>
              {hasNext ? (
                <Link href={`${pagePath}?page=${page + 1}`}>{t.next}</Link>
              ) : <span />}
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}
