import ProfileNav from "/components/common/Nav";
import {cloneElement} from "react";
import Intro from "/components/born-on-this-day/Intro";
import Header from "/components/born-on-this-day/Header";
import PeopleSection from "/components/born-on-this-day/PeopleSection";
import OccupationBreakdown from "/components/born-on-this-day/OccupationBreakdown";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {safeFetchJson} from "/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "/app/utils/hreflang";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import GoogleAdSenseScript from "/components/common/GoogleAdSenseScript";

function formatDateForDisplay(month, day, lang = "en") {
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const t = getTranslations(lang);

  // Use localized date formatter if available
  if (t.bornOnThisDay?.formatDate) {
    return t.bornOnThisDay.formatDate({month: monthNum, day: dayNum});
  }

  // Fallback to English format
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = MONTH_NAMES[monthNum - 1];
  const suffix = dayNum === 1 || dayNum === 21 || dayNum === 31 ? "st"
    : dayNum === 2 || dayNum === 22 ? "nd"
    : dayNum === 3 || dayNum === 23 ? "rd"
    : "th";

  return `${monthName} ${dayNum}${suffix}`;
}

async function getPeopleBornOnDay(month, day, lang = "en") {
  // RPC endpoint returns person_id, slug, name, birthdate, hpi, l, occupation (translated)
  const url = `${BASE_API}/rpc/born_on_day?m=${month}&d=${day}&lang=${lang}`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.SHORT}}, []);
}

function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function localizePeopleNames(people, lang = "en") {
  if (lang === DEFAULT_LOCALE || !Array.isArray(people) || !people.length) {
    return people;
  }

  const personIds = [...new Set(
    people
      .map(person => Number(person.person_id || person.id))
      .filter(id => Number.isInteger(id) && id > 0),
  )];

  if (!personIds.length) {
    return people;
  }

  const batches = chunkArray(personIds, 100);
  const localizedRecords = [];

  for (const batch of batches) {
    const url = `${BASE_API}/person?id=in.(${batch.join(",")})&select=id,name,translations`;
    const data = await safeFetchJson(
      url,
      {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
      [],
    );

    if (Array.isArray(data)) {
      localizedRecords.push(...data);
    }
  }

  const localizedNameById = new Map(
    localizedRecords.map(person => [
      person.id,
      person.translations?.[lang] || person.name,
    ]),
  );

  return people.map(person => {
    const localizedName = localizedNameById.get(person.person_id || person.id);
    return localizedName
      ? {
          ...person,
          name: localizedName,
        }
      : person;
  });
}

export async function generateMetadata(props, parent) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const {date, locale} = params;
  const [month, day] = date.split("-");

  // Validate date format
  if (!month || !day || month.length !== 2 || day.length !== 2) {
    return {title: "Invalid Date | Pantheon"};
  }

  // Determine locale
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  const displayDate = formatDateForDisplay(month, day, lang);
  const previousImages = (await parent).openGraph?.images || [];

  // Use localized title and description if available
  const title = t.bornOnThisDay?.metaTitle?.({displayDate}) ||
    `Famous Birthdays on ${displayDate} | Who Was Born Today? | Pantheon`;
  const description = t.bornOnThisDay?.metaDescription?.({displayDate}) ||
    `Discover the most famous people born on ${displayDate} throughout history. Explore birthday profiles of celebrities, historical figures, scientists, artists, athletes and more who share this birthday.`;

  return {
    title,
    description,
    keywords: `birthdays ${displayDate}, famous birthdays, born on ${displayDate}, celebrity birthdays, historical birthdays, who was born on ${displayDate}`,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        `${process.env.URL || "https://pantheon.world"}/api/screenshot/born-on-this-day/${lang}/${date}`,
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${process.env.URL || "https://pantheon.world"}/api/screenshot/born-on-this-day/${lang}/${date}`],
    },
    alternates: {
      canonical: buildCanonical(lang, `/profile/born-on-this-day/${date}`),
      languages: buildLanguageAlternates(`/profile/born-on-this-day/${date}`),
    },
  };
}

export default async function Page(props) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const {date, locale} = params;

  // Validate and parse date (MM-DD format)
  const [month, day] = date.split("-");

  if (!month || !day || month.length !== 2 || day.length !== 2) {
    return (
      <div className="error-page">
        <h1>Invalid Date Format</h1>
        <p>Please use the format MM-DD (e.g., 02-21 for February 21st)</p>
      </div>
    );
  }

  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);

  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return (
      <div className="error-page">
        <h1>Invalid Date</h1>
        <p>Please provide a valid month (01-12) and day (01-31)</p>
      </div>
    );
  }

  // Determine current locale
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;

  // Fetch people born on this day (returns person_id, slug, name, birthdate, hpi, l, occupation)
  const peopleBornOnDay = await getPeopleBornOnDay(month, day, lang);

  // Map person_id to id for consistency
  const peopleWithIds = peopleBornOnDay.map(p => ({
    ...p,
    id: p.person_id,
  }));
  const people = await localizePeopleNames(peopleWithIds, lang);

  const displayDate = formatDateForDisplay(month, day, lang);

  const sections = [
    {
      slug: "people",
      title: "Famous People",
      content: <PeopleSection date={date} displayDate={displayDate} people={people} lang={lang} />,
    },
    {
      slug: "occupations",
      title: "By Occupation",
      content: <OccupationBreakdown date={date} displayDate={displayDate} people={people} lang={lang} />,
    },
  ];

  return (
    <div className="person">
      <GoogleAdSenseScript />
      <Header date={date} displayDate={displayDate} people={people} lang={lang} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro
          date={date}
          displayDate={displayDate}
          month={month}
          day={day}
          people={people}
          lang={lang}
        />
      </div>
      {sections.map((section, key) =>
        cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        })
      )}
    </div>
  );
}
