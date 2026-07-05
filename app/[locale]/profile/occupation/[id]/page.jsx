import {cloneElement} from "react";
import {plural} from "pluralize";
// import ProfileNav from "../../../../components/common/Nav";
import Intro from "@/components/occupation/Intro";
import Header from "@/components/occupation/Header";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import People from "@/components/occupation/sections/People";
import Places from "@/components/occupation/sections/Places";
import PlacesOverTime from "@/components/occupation/sections/PlacesOverTime";
import Lifespans from "@/components/occupation/sections/Lifespans";
// import {
//   NUM_RANKINGS,
//   NUM_RANKINGS_PRE,
//   NUM_RANKINGS_POST,
// } from "@/components/utils/consts";
import {toTitleCase} from "../../../../../components/utils/vizHelpers";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {
  safeFetchArray,
  safeFetchArrayPaged,
  safeFetchFirst,
} from "@/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {notFound} from "next/navigation";

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

async function getOccupation(occupationId, lang = DEFAULT_LOCALE) {
  const url = `${BASE_API}/occupation?occupation_slug=eq.${occupationId}&select=*,${lang}_occupation:translations->${lang}->>occupation`;
  return await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    {},
  );
}

// async function getCountryRanks(countryRankLow, countryRankHigh) {
//   const res = await fetch(
//     `https://api.pantheon.world/country?born_rank_unique=gte.${countryRankLow}&born_rank_unique=lte.${countryRankHigh}&order=born_rank_unique`
//   );
//   return res.json();
// }

// No occupation(...) embed here: every row shares the page's occupation, so
// the caller attaches it in JS instead of repeating it per row. Fetched in
// id-ordered pages to keep each fetch under Next's 2MB data-cache limit
// (big occupations were 10-20MB and never cached).
async function getPeople(occupationId) {
  const encodedOccupationId = encodePostgrestValue(occupationId);
  const url = `${BASE_API}/person?occupation=eq.${encodedOccupationId}&order=id.asc&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchArrayPaged(url, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
}

async function getPeopleHpi(occupationId) {
  const encodedOccupationId = encodePostgrestValue(occupationId);
  const url = `${BASE_API}/person_ranks?occupation=eq.${encodedOccupationId}&order=hpi.desc.nullslast,id.asc&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchArrayPaged(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    12000,
  );
}

// async function getPeopleDiedHere(countryId) {
//   const res = await fetch(
//     `https://api.pantheon.world/person?dplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,name,slug,id,hpi,hpi_prev,gender,birthyear,deathyear,alive`
//   );
//   return res.json();
// }

export async function generateMetadata(props, parent) {
  const params = await props.params;
  // read route params
  const id = params.id;
  const lang = SUPPORTED_LOCALES.includes(params.locale)
    ? params.locale
    : DEFAULT_LOCALE;

  // fetch data
  const occupation = await getOccupation(id, lang);

  // Unknown slugs resolve to the {} fallback; plural() lowercases its input,
  // so it throws on undefined.
  if (!occupation?.occupation) {
    return {title: "Not Found | Pantheon"};
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  const localizedOccupation = occupation[`${lang}_occupation`] || occupation.occupation;
  const occupationDisplay = lang === DEFAULT_LOCALE
    ? toTitleCase(plural(localizedOccupation))
    : localizedOccupation;
  const ogTitle = `${occupationDisplay} | Pantheon`;
  const ogImageUrl = `https://pantheon.world/api/screenshot/occupation?id=${id}`;
  return {
    title: ogTitle,
    openGraph: {
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: ogTitle,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: buildCanonical(params.locale, `/profile/occupation/${id}`),
      languages: buildLanguageAlternates(`/profile/occupation/${id}`),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const {id, locale} = params;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const [occupation, occupations] = await Promise.all([
    getOccupation(id, lang),
    getOccupations(),
  ]);
  if (!occupation?.id) {
    notFound();
  }

  const [peopleAttrs, peopleHpi] = await Promise.all([
    getPeople(occupation.id),
    getPeopleHpi(occupation.id),
  ]);

  const people = peopleAttrs
    .map(person => {
      const hpiData = peopleHpi.find(hpi => hpi.id === person.id);
      return {
        ...person,
        // getPeople no longer embeds the (identical) occupation row per person.
        occupation,
        ...(hpiData || {}),
      };
    })
    .sort((a, b) => b.hpi - a.hpi);

  // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // we calculate and add them...
  // peopleBornHere =
  //   !peopleBornHere ||
  //   peopleBornHere
  //     .sort((personA, personB) => personB.hpi - personA.hpi)
  //     .map((d, i) => ({ ...d, bplace_country_rank_unique: i + 1 }));
  // peopleDiedHere =
  //   !peopleDiedHere ||
  //   peopleDiedHere
  //     .sort((personA, personB) => personB.hpi - personA.hpi)
  //     .map((d, i) => ({ ...d, dplace_country_rank_unique: i + 1 }));

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  const localizedOccupation = occupation[`${lang}_occupation`] || occupation.occupation;
  const localizedOccupationObj = {
    ...occupation,
    occupation: localizedOccupation,
  };
  const occupationDisplay = lang === DEFAULT_LOCALE
    ? toTitleCase(plural(localizedOccupation))
    : localizedOccupation;
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const t = getTranslations(lang);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const breadcrumbItems = [
    {label: t.nav?.home || tEn.nav.home, href: `${localePrefix}/`},
    {
      label: t.nav?.occupations || tEn.nav.occupations,
      href: `${localePrefix}/profile/occupation`,
    },
    {label: occupationDisplay},
  ];

  const sections = [
    // {slug: "people", title: "People"},
    // {slug: "places", title: "Places"},
    // {slug: "places-over-time", title: "Places Over Time"},
    // {slug: "overlapping-lives", title: "Overlapping Lives"},
    // {slug: "related-occupations", title: "Related Occupations"}
    {
      slug: "people",
      title: "People",
      content: <People occupation={occupation} people={people} />,
    },
    {
      slug: "places",
      title: "Places",
      content: <Places occupation={occupation} people={people} />,
    },
    {
      slug: "places-over-time",
      title: "Places Over Time",
      content: <PlacesOverTime occupation={occupation} people={people} />,
    },
    {
      slug: "lifespans",
      title: "Lifespans",
      content: (
        <Lifespans attrs={attrs} occupation={occupation} people={people} />
      ),
    },
  ];

  return (
    <div className="person occupation-page">
      <Header
        occupation={localizedOccupationObj}
        people={people}
        locale={lang}
        breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
      />
      <div className="about-section">
        {/* <ProfileNav sections={sections} /> */}
        <Intro occupation={occupation} occupations={occupations} />
      </div>
      {sections.map((section, key) =>
        cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        }),
      )}
    </div>
  );
}
