import Breadcrumbs from "@/components/common/Breadcrumbs";
import Header from "@/components/occupation-country/Header";
import Intro from "@/components/occupation-country/Intro";
import TrendingBanner from "@/components/occupation-country/TrendingBanner";
import TrendingPeople from "@/components/occupation-country/sections/TrendingPeople";
import TopTen from "@/components/occupation-country/sections/TopTen";
import FullRanking from "@/components/occupation-country/sections/FullRanking";
import Movers from "@/components/occupation-country/sections/Movers";
import Highlights from "@/components/occupation-country/sections/Highlights";
import CountryComparison from "@/components/occupation-country/sections/CountryComparison";
import Birthplaces from "@/components/occupation-country/sections/Birthplaces";
import BirthDecades from "@/components/occupation-country/sections/BirthDecades";
import Lifespans from "@/components/occupation-country/sections/Lifespans";
import Faq, {buildFaqItems} from "@/components/occupation-country/sections/Faq";
import Footer from "@/components/occupation-country/sections/Footer";
import {loadOccupationCountry} from "@/components/occupation-country/data";
import {COLORS_DOMAIN} from "@/components/utils/consts";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {
  buildNames,
  formatLifespan,
  formatList,
  formatNumber,
  getOcStrings,
} from "@/app/occupationCountryTranslations";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {safeFetchArray} from "@/app/utils/safeFetch";
import {notFound} from "next/navigation";

const SITE_URL = "https://pantheon.world";

async function getTrendingStatus(occupationSlug, countrySlug, lang = "en") {
  // Only surface GSC trend entries from the last 7 days
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const url = `${BASE_API}/trend_gsc?lang=eq.${lang}&page_type=eq.occupation_country&run_at=gte.${sevenDaysAgo}&page_url=like.*profile/occupation/${occupationSlug}/country/${countrySlug}*&select=page_url,trend_score,reason,clicks_curr,impr_curr&limit=1`;
  const data = await safeFetchArray(url, {next: {revalidate: REVALIDATE_PERIODS.SHORT}});
  return data.length > 0 ? data[0] : null;
}

function resolveLang(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export async function generateMetadata(props) {
  const {locale, id, countryId} = await props.params;
  const lang = resolveLang(locale);
  const data = await loadOccupationCountry(id, countryId, lang);
  if (!data) return {title: "Not Found | Pantheon"};

  const {occupation, country, people, stats} = data;
  const s = getOcStrings(lang);
  const names = buildNames({occupation, country, lang, count: stats.count});
  const top = people[0];
  const params = {
    ...names,
    count: stats.count,
    countFormatted: formatNumber(stats.count, lang),
    top: top?.localizedName,
    topYears: top ? formatLifespan(top, lang) : "",
    names: formatList(people.slice(0, 3).map(p => p.localizedName), lang),
  };

  const title = `${top ? s.metaTitle(params) : names.groupTitle} | Pantheon`;
  const description = stats.count === 1
    ? s.metaDescriptionSingle(params)
    : s.metaDescription(params);
  const path = `/profile/occupation/${id}/country/${countryId}`;
  const ogImage = `${SITE_URL}/api/screenshot/occupation-country?occupation=${id}&country=${country.country_code}&lang=${lang}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: buildCanonical(lang, path),
      images: [{url: ogImage, width: 1200, height: 630, type: "image/png", alt: title}],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: buildCanonical(lang, path),
      languages: buildLanguageAlternates(path),
    },
  };
}

export default async function Page(props) {
  const {locale, id, countryId} = await props.params;
  const lang = resolveLang(locale);
  const t = getTranslations(lang);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;

  const [data, trendingStatus] = await Promise.all([
    loadOccupationCountry(id, countryId, lang),
    getTrendingStatus(id, countryId, lang),
  ]);
  if (!data) notFound();

  const {occupation, country, people, stats} = data;
  const names = buildNames({occupation, country, lang, count: stats.count});
  const pagePath = `${localePrefix}/profile/occupation/${id}/country/${countryId}`;
  const pageUrl = `${SITE_URL}${pagePath}`;
  const rankingsHref = `${localePrefix}/explore/rankings?show=people&years=-3501,2025&place=${country.country_code}&occupation=${encodeURIComponent(occupation.id)}`;

  const breadcrumbItems = [
    {label: t.nav?.home || tEn.nav.home, href: `${localePrefix}/`},
    {label: t.nav?.occupations || tEn.nav.occupations, href: `${localePrefix}/profile/occupation`},
    {label: names.occPluralTitle.charAt(0).toLocaleUpperCase() + names.occPluralTitle.slice(1), href: `${localePrefix}/profile/occupation/${id}`},
    {label: names.country},
  ];

  const faqItems = buildFaqItems({data, names, lang, localePrefix});

  const listed = people.slice(0, 100);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        item: `${SITE_URL}${item.href || pagePath}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: names.groupTitle,
      url: pageUrl,
      numberOfItems: listed.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: listed.map((person, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: person.localizedName,
          url: `${SITE_URL}${localePrefix}/profile/person/${person.slug}`,
          ...(i < 10 && {
            image: `https://static.pantheon.world/profile/people/${person.id}.jpg`,
            jobTitle: names.occSingularTitle,
            ...(Number.isFinite(person.birthyear) && person.birthyear > 0 && {birthDate: `${person.birthyear}`}),
            ...(Number.isFinite(person.deathyear) && person.deathyear > 0 && {deathDate: `${person.deathyear}`}),
          }),
        },
      })),
    },
    faqItems.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {"@type": "Answer", text: item.answer},
      })),
    },
  ].filter(Boolean);

  return (
    <div
      className="person occupation-country-page"
      style={{"--oc-accent": COLORS_DOMAIN[occupation.domain_slug] || "#9a3412"}}
    >
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(block).replace(/</g, "\\u003c")}}
        />
      ))}
      <Header
        country={country}
        occupation={occupation}
        people={people}
        names={names}
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
      <Intro data={data} names={names} locale={lang} />
      <TopTen
        people={people}
        names={names}
        locale={lang}
        hasFullRanking={stats.count > 10}
      />
      <FullRanking
        people={people}
        names={names}
        locale={lang}
        rankingsHref={rankingsHref}
      />
      <Movers data={data} locale={lang} />
      <TrendingPeople
        occupation={occupation}
        names={names}
        countryName={country.country}
        countrySlug={country.slug}
        locale={lang}
      />
      <Highlights data={data} names={names} locale={lang} />
      <CountryComparison data={data} names={names} locale={lang} />
      <Birthplaces data={data} names={names} locale={lang} />
      <BirthDecades data={data} locale={lang} rankingsHref={rankingsHref} />
      <Lifespans people={people} occupation={occupation} locale={lang} />
      <Faq items={faqItems} locale={lang} />
      <Footer data={data} names={names} locale={lang} />
    </div>
  );
}
