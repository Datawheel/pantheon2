import {plural} from "pluralize";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import Header from "@/components/occupation-country/Header";
import Intro from "@/components/occupation-country/Intro";
import TrendingBanner from "@/components/occupation-country/TrendingBanner";
import TrendingPeople from "@/components/occupation-country/sections/TrendingPeople";
import TopTen from "@/components/occupation-country/sections/TopTen";
// import People from "@/components/occupation-country/sections/People";
import BirthDecades from "@/components/occupation-country/sections/BirthDecades";
import Lifespans from "@/components/occupation-country/sections/Lifespans";
import Footer from "@/components/occupation-country/sections/Footer";
import {toTitleCase} from "@/components/utils/vizHelpers";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {safeFetchArray, safeFetchArrayPaged} from "@/app/utils/safeFetch";
import {notFound} from "next/navigation";

// Safe JSON fetch with logging for debugging HTML responses
async function safeFetchJson(url, options = {}, fallback = null) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.error(`[safeFetchJson] HTTP ${res.status} for: ${url}`);
      return fallback;
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[safeFetchJson] Got HTML instead of JSON for: ${url}`);
      console.error(`[safeFetchJson] HTML preview: ${text.slice(0, 200)}`);
      return fallback;
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[safeFetchJson] Error for ${url}: ${e.message}`);
    return fallback;
  }
}

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

async function getOccupation(occupationId, lang = "en") {
  const url = `${BASE_API}/occupation?occupation_slug=eq.${occupationId}&select=*,${lang}_occupation:translations->${lang}->>occupation`;
  const data = await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
  return data.length > 0 ? data[0] : {};
}

async function getCountry(countryId, lang = "en") {
  const url = `${BASE_API}/country?slug=eq.${countryId}&select=*,${lang}_country:translations->${lang}->>country,${lang}_demonym:translations->${lang}->>demonym_m_plural,${lang}_nationality_adj:translations->${lang}->>nationality_adj_m,${lang}_from_country:translations->${lang}->>from_country`;
  const data = await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
  return data.length > 0 ? data[0] : {};
}

async function getAllCountriesInOccupation(occupationId, lang = "en") {
  const encodedOccupationId = encodePostgrestValue(occupationId);
  const url = `${BASE_API}/occupation_country?occupation=eq.${encodedOccupationId}&order=num_people.desc.nullslast&select=*,country_data:country!country(slug,country,${lang}_country:translations->${lang}->>country,${lang}_from_country:translations->${lang}->>from_country)`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

async function getAllOccupationsInCountry(countryId, lang = "en") {
  const url = `${BASE_API}/occupation_country?country=eq.${countryId}&order=num_people.desc.nullslast&select=*,occupation_data:occupation!occupation(occupation_slug,occupation,${lang}_occupation:translations->${lang}->>occupation)`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

// No occupation(...) embed here: every row shares the page's occupation, so
// the caller attaches it in JS instead of repeating it per row. Fetched in
// id-ordered pages to keep each fetch under Next's 2MB data-cache limit
// (big combos like US actors were ~7MB and never cached).
async function getPeople(occupationId, countryId) {
  const encodedOccupationId = encodePostgrestValue(occupationId);
  const url = `${BASE_API}/person?occupation=eq.${encodedOccupationId}&bplace_country=eq.${countryId}&order=id.asc&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive,famous_for,description`;
  return await safeFetchArrayPaged(url, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
}

async function getPeopleHpi(occupationId, countryId) {
  const encodedOccupationId = encodePostgrestValue(occupationId);
  const url = `${BASE_API}/person_ranks?occupation=eq.${encodedOccupationId}&bplace_country=eq.${countryId}&order=hpi.desc.nullslast,id.asc&select=id,hpi,hpi_prev,l,l_prev,non_en_page_views`;
  return await safeFetchArrayPaged(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    12000,
  );
}

async function getTrendingStatus(occupationSlug, countrySlug, lang = "en") {
  // Check if this occupation-country combo is in the trending pages
  // Only include entries from the last 7 days
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const url = `${BASE_API}/trend_gsc?lang=eq.${lang}&page_type=eq.occupation_country&run_at=gte.${sevenDaysAgo}&page_url=like.*profile/occupation/${occupationSlug}/country/${countrySlug}*&select=page_url,trend_score,reason,clicks_curr,impr_curr&limit=1`;
  const data = await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}},
  );
  return data.length > 0 ? data[0] : null;
}

function formatNumber(num, locale = "en") {
  return new Intl.NumberFormat(locale).format(num);
}

export async function generateMetadata(props, parent) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const {locale, id, countryId} = params;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const baseUrl = process.env.URL || "https://pantheon.world";

  // fetch data
  const occupation = await getOccupation(id, lang);
  const country = await getCountry(countryId, lang);

  if (!occupation || !occupation.occupation || !country || !country.country) {
    return {title: "Not Found | Pantheon"};
  }

  // Get localized names, fallback to English
  const localizedOccupation =
    occupation[`${lang}_occupation`] || occupation.occupation;
  const localizedCountry = country[`${lang}_country`] || country.country;
  // demonym can be null in the DB even for valid countries; fall back to the
  // country name so metadata never reads "undefined".
  const localizedDemonym =
    country[`${lang}_demonym`] || country.demonym || localizedCountry;
  const localizedNationalityAdj =
    country[`${lang}_nationality_adj`] || country.demonym || localizedCountry;

  // Get count of people for this occupation + country
  const countRes = await fetch(
    `${BASE_API}/person_ranks?occupation=eq.${encodePostgrestValue(occupation.id)}&bplace_country=eq.${country.id}&select=id`,
    {
      headers: {"Prefer": "count=exact"},
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    },
  );
  const contentRange = countRes.headers.get("content-range");
  let totalCount = 0;
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)/);
    if (match) {
      totalCount = parseInt(match[1], 10);
    }
  }

  const previousImages = (await parent).openGraph?.images || [];

  // For English, use plural form; for other languages, use the localized occupation as-is
  const occupationDisplay =
    lang === "en"
      ? toTitleCase(plural(localizedOccupation))
      : localizedOccupation;

  const occupationSingular = toTitleCase(localizedOccupation);

  const title = tc.metaTitle
    ? tc.metaTitle({
        demonym: localizedNationalityAdj,
        occupationPlural: occupationDisplay,
      })
    : `${tc.greatest || "Greatest"} ${localizedNationalityAdj} ${occupationDisplay} | Pantheon`;
  const description = tc.metaDescription
    ? tc.metaDescription({
        countFormatted: formatNumber(totalCount, lang),
        demonym: localizedDemonym,
        occupationPlural: occupationDisplay,
        occupationPluralLower: occupationDisplay.toLowerCase(),
        occupationSingular: occupationSingular,
        occupationSingularLower: occupationSingular.toLowerCase(),
        country: localizedCountry,
      })
    : `Discover the ${formatNumber(totalCount, lang)} most famous ${localizedDemonym} ${occupationDisplay.toLowerCase()} in history. Explore notable ${occupationSingular.toLowerCase()} profiles from ${localizedCountry} ranked by historical significance.`;

  return {
    title,
    description,
    keywords: `${localizedDemonym} ${occupationDisplay.toLowerCase()}, famous ${occupationDisplay.toLowerCase()} from ${localizedCountry}, ${localizedCountry} ${occupationSingular.toLowerCase()}, notable ${localizedDemonym} ${occupationDisplay.toLowerCase()}`,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/screenshot/occupation-country?occupation=${id}&country=${country.country_code}&lang=${lang}`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${baseUrl}/api/screenshot/occupation-country?occupation=${id}&country=${country.country_code}&lang=${lang}`,
      ],
    },
    alternates: {
      canonical: buildCanonical(lang, `/profile/occupation/${id}/country/${countryId}`),
      languages: buildLanguageAlternates(`/profile/occupation/${id}/country/${countryId}`),
    },
  };
}

export default async function Page(props) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const {locale, id, countryId} = params;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const baseUrl = process.env.URL || "https://pantheon.world";

  const [occupations, occupation, country, trendingStatus] = await Promise.all([
    getOccupations(),
    getOccupation(id, lang),
    getCountry(countryId, lang),
    getTrendingStatus(id, countryId, lang),
  ]);
  if (!occupation?.id || !country?.id) {
    notFound();
  }

  const [
    allCountriesInOccupation,
    allOccupationsInCountry,
    peopleAttrs,
    peopleHpi,
  ] = await Promise.all([
    getAllCountriesInOccupation(occupation.occupation, lang),
    getAllOccupationsInCountry(country.id, lang),
    getPeople(occupation.id, country.id),
    getPeopleHpi(occupation.id, country.id),
  ]);

  // Merge peopleHpi data into people array
  const people = peopleAttrs
    .map(person => {
      const hpiData = peopleHpi.find(hpi => hpi.id === person.id);
      return {
        ...person,
        // getPeople no longer embeds the (identical) occupation row per person.
        occupation,
        ...(hpiData || {}), // Spread hpiData if found, otherwise spread empty object
      };
    })
    .sort((a, b) => b.hpi - a.hpi);

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  // Get localized names, fallback to English
  const localizedOccupation =
    occupation[`${lang}_occupation`] || occupation.occupation;
  const localizedCountry = country[`${lang}_country`] || country.country;
  // demonym can be null in the DB even for valid countries; fall back to the
  // country name so metadata never reads "undefined".
  const localizedDemonym =
    country[`${lang}_demonym`] || country.demonym || localizedCountry;
  const localizedNationalityAdj =
    country[`${lang}_nationality_adj`] || country.demonym || localizedCountry;
  const localizedFromCountry = country[`${lang}_from_country`];

  // Create localized versions of occupation and country to pass to components
  const localizedOccupationObj = {
    ...occupation,
    occupation: localizedOccupation,
  };

  const localizedCountryObj = {
    ...country,
    country: localizedCountry,
    demonym: localizedDemonym,
    nationalityAdj: localizedNationalityAdj,
    fromCountry: localizedFromCountry,
  };

  // For English, use plural form; for other languages, use the occupation as-is
  const occupationDisplay = lang === "en"
    ? toTitleCase(plural(localizedOccupation))
    : localizedOccupation;

  const pagePath = `${localePrefix}/profile/occupation/${id}/country/${countryId}`;
  const breadcrumbItems = [
    {label: t.nav?.home || tEn.nav.home, href: `${localePrefix}/`},
    {
      label: t.nav?.occupations || tEn.nav.occupations,
      href: `${localePrefix}/profile/occupation`,
    },
    {
      label: occupationDisplay,
      href: `${localePrefix}/profile/occupation/${id}`,
    },
    {label: localizedCountry},
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${baseUrl}${item.href || pagePath}`,
    })),
  };

  const topPeople = people.slice(0, 10);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${t.occupationCountry?.greatest || tEn.occupationCountry.greatest} ${localizedNationalityAdj} ${occupationDisplay}`,
    url: `${baseUrl}${pagePath}`,
    numberOfItems: topPeople.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: topPeople.map((person, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: person.name,
        url: `${baseUrl}${localePrefix}/profile/person/${person.slug}`,
        image: `https://static.pantheon.world/profile/people/${person.id}.jpg`,
        jobTitle: toTitleCase(localizedOccupation),
        nationality: {"@type": "Country", name: localizedCountry},
        ...(person.birthyear > 0 && {birthDate: `${person.birthyear}`}),
        ...(person.deathyear > 0 && {deathDate: `${person.deathyear}`}),
      },
    })),
  };

  return (
    <div className="person occupation-country-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbJsonLd)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(itemListJsonLd)}}
      />
      <Header
        country={localizedCountryObj}
        occupation={localizedOccupationObj}
        people={people}
        locale={lang}
        breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
      />
      {trendingStatus && (
        <TrendingBanner
          locale={lang}
          trendScore={trendingStatus.trend_score}
          reason={trendingStatus.reason}
          clicks={trendingStatus.clicks_curr}
          impressions={trendingStatus.impr_curr}
        />
      )}
      <TrendingPeople
        occupation={localizedOccupationObj}
        country={localizedCountryObj}
        countryName={country.country}
        countrySlug={country.slug}
        locale={lang}
      />
      <div className="about-section">
        {/* <ProfileNav sections={this.sections} /> */}
        <Intro
          country={localizedCountryObj}
          occupation={localizedOccupationObj}
          allCountriesInOccupation={allCountriesInOccupation}
          locale={lang}
        />
      </div>
      <TopTen
        country={localizedCountryObj}
        occupation={localizedOccupationObj}
        people={people}
        locale={lang}
      />
      <BirthDecades
        people={people}
        country={localizedCountryObj}
        occupation={localizedOccupationObj}
        locale={lang}
      />
      {/* <People
        country={localizedCountryObj}
        occupation={localizedOccupationObj}
        people={people}
        title={"People"}
        slug={"people"}
        locale={lang}
      /> */}
      <Lifespans
        attrs={attrs}
        people={people}
        occupation={localizedOccupationObj}
        slug={"overlapping-lives"}
        title={"Overlapping Lives"}
      />
      <Footer
        allCountriesInOccupation={allCountriesInOccupation}
        allOccupationsInCountry={allOccupationsInCountry}
        locale={lang}
      />
    </div>
  );
}
