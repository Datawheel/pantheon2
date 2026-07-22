import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {REVALIDATE_PERIODS} from "@/app/constants";

const WIKIPEDIA_BATCH_SIZE = 50;
const WIKIPEDIA_USER_AGENT =
  "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)";

export function normalizeLocationLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function formatLocationNumber(value, locale = DEFAULT_LOCALE) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return `${value ?? ""}`;
  try {
    return new Intl.NumberFormat(normalizeLocationLocale(locale)).format(numeric);
  } catch {
    return numeric.toLocaleString("en");
  }
}

export function localizeCountry(country, locale = DEFAULT_LOCALE) {
  if (!country || typeof country !== "object") return country;
  const normalized = normalizeLocationLocale(locale);
  const translation = country.translations?.[normalized];
  const countryFields = {...country};
  delete countryFields.translations;
  if (!translation) return countryFields;

  return {
    ...countryFields,
    englishCountry: country.englishCountry || country.country,
    country: translation.country || country.country,
    demonym: translation.demonym || country.demonym,
    inCountry: translation.in_country,
    toCountry: translation.to_country,
    fromCountry: translation.from_country,
  };
}

export function localizeOccupation(occupation, locale = DEFAULT_LOCALE) {
  if (!occupation || typeof occupation !== "object") return occupation;
  const normalized = normalizeLocationLocale(locale);
  const translation = occupation.translations?.[normalized];
  const occupationFields = {...occupation};
  delete occupationFields.translations;
  if (!translation) return occupationFields;

  return {
    ...occupationFields,
    englishOccupation: occupation.englishOccupation || occupation.occupation,
    occupation: translation.occupation || occupation.occupation,
    industry: translation.industry || occupation.industry,
    domain: translation.domain || occupation.domain,
    group: translation.group || occupation.group,
  };
}

export function buildLocalizedOccupationMap(
  occupations,
  locale = DEFAULT_LOCALE,
) {
  return new Map(
    (occupations || []).map(occupation => {
      const localized = localizeOccupation(occupation, locale);
      return [`${occupation.id}`, localized];
    }),
  );
}

export function localizePeople(
  people,
  locale = DEFAULT_LOCALE,
  occupationById = new Map(),
) {
  const normalized = normalizeLocationLocale(locale);
  return (people || []).map(person => {
    const {
      localized_name: localizedName,
      ...personFields
    } = person;
    const occupationId = person.occupation?.id ?? person.occupation_id;
    const localizedOccupation = occupationById.get(`${occupationId}`)
      || localizeOccupation(person.occupation, normalized);

    return {
      ...personFields,
      englishName: person.englishName || person.name,
      name:
        localizedName
        || person.translations?.[normalized]
        || person.name,
      occupation: localizedOccupation || person.occupation,
      bplace_country: localizeCountry(person.bplace_country, normalized),
      dplace_country: localizeCountry(person.dplace_country, normalized),
    };
  });
}

function getPlaceId(place) {
  const id = place?.id;
  return Number.isFinite(Number(id)) ? `${Number(id)}` : null;
}

/**
 * Pantheon place IDs are English Wikipedia page IDs. The langlinks endpoint
 * therefore gives us a stable localized display name without changing the
 * canonical Pantheon slug used in URLs.
 */
export async function getLocalizedPlaceNameMap(
  places,
  locale = DEFAULT_LOCALE,
) {
  const normalized = normalizeLocationLocale(locale);
  const ids = [
    ...new Set((places || []).map(getPlaceId).filter(Boolean)),
  ];
  const names = new Map();

  if (normalized === DEFAULT_LOCALE || !ids.length) return names;

  const batches = [];
  for (let index = 0; index < ids.length; index += WIKIPEDIA_BATCH_SIZE) {
    batches.push(ids.slice(index, index + WIKIPEDIA_BATCH_SIZE));
  }

  // Wikimedia throttles several simultaneous langlinks calls aggressively.
  // Sequential batches are still fast (50 page IDs each), cache cleanly for a
  // month, and avoid turning every related city back into an English fallback.
  const pages = [];
  for (const batch of batches) {
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("prop", "langlinks");
    url.searchParams.set("pageids", batch.join("|"));
    url.searchParams.set("lllang", normalized);
    // The limit applies to the whole query, not per page. With one requested
    // language, `max` returns one langlink for every page in the batch.
    url.searchParams.set("lllimit", "max");
    url.searchParams.set("redirects", "1");
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": WIKIPEDIA_USER_AGENT,
          "Api-User-Agent": WIKIPEDIA_USER_AGENT,
        },
        next: {revalidate: REVALIDATE_PERIODS.LONG},
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (Array.isArray(data?.query?.pages)) pages.push(...data.query.pages);
    } catch {
      // A missing optional translation should not make the profile unavailable.
    }
  }

  pages.forEach(page => {
    const localizedTitle = page?.langlinks?.[0]?.title;
    if (localizedTitle && page?.pageid != null) {
      names.set(`${page.pageid}`, localizedTitle);
    }
  });

  return names;
}

export function localizePlace(place, localizedNames) {
  if (!place || typeof place !== "object") return place;
  const localizedName = localizedNames?.get(getPlaceId(place));
  if (!localizedName) return place;

  return {
    ...place,
    englishPlace: place.englishPlace || place.place,
    place: localizedName,
  };
}

export function localizePersonPlaces(people, localizedNames) {
  return (people || []).map(person => ({
    ...person,
    bplace_geonameid: localizePlace(
      person.bplace_geonameid,
      localizedNames,
    ),
    dplace_geonameid: localizePlace(
      person.dplace_geonameid,
      localizedNames,
    ),
  }));
}
