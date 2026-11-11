import Breadcrumbs from "@/components/common/Breadcrumbs";
import Faq from "@/components/occupation-country/sections/Faq";
import {
  VsCombined,
  VsEras,
  VsHeader,
  VsMatchups,
  VsRelated,
  VsScoreboard,
} from "@/components/occupation-country/vs/VsSections";
import {buildVsFaq, buildVsModel} from "@/components/occupation-country/vs/model";
import {VS_SIDE_B_COLORS, vsSlugs} from "@/components/occupation-country/vs";
import {loadOccupationCountry} from "@/components/occupation-country/data";
import {COLORS_DOMAIN} from "@/components/utils/consts";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {cap} from "@/app/occupationCountryTranslations";
import {getVsStrings} from "@/app/occupationCountryVsTranslations";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {notFound, permanentRedirect} from "next/navigation";

const SITE_URL = "https://pantheon.world";

function resolveLang(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

const vsPathFor = (id, a, b) => `/profile/occupation/${id}/country/${a}/vs/${b}`;

async function loadVs(id, countryId, otherId, lang) {
  const [dataA, dataB] = await Promise.all([
    loadOccupationCountry(id, countryId, lang),
    loadOccupationCountry(id, otherId, lang),
  ]);
  return buildVsModel(dataA, dataB, lang);
}

export async function generateMetadata(props) {
  const {locale, id, countryId, otherId} = await props.params;
  const lang = resolveLang(locale);
  const model = await loadVs(id, countryId, otherId, lang);
  if (!model) return {title: "Not Found | Pantheon"};

  const vs = getVsStrings(lang);
  const title = `${vs.metaTitle(model.v)} | Pantheon`;
  const description = vs.metaDescription(model.v);
  const [a, b] = vsSlugs(countryId, otherId);
  const path = vsPathFor(id, a, b);
  const ogImage = `${SITE_URL}/api/screenshot/occupation-country-vs?occupation=${encodeURIComponent(id)}&a=${a}&b=${b}&lang=${lang}`;

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
  const {locale, id, countryId, otherId} = await props.params;
  const lang = resolveLang(locale);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;

  // One URL per pair: same-country goes to the plain page, reversed order
  // to the alphabetical one.
  if (countryId === otherId) {
    permanentRedirect(`${localePrefix}/profile/occupation/${id}/country/${countryId}`);
  }
  const [a, b] = vsSlugs(countryId, otherId);
  if (a !== countryId) permanentRedirect(`${localePrefix}${vsPathFor(id, a, b)}`);

  const model = await loadVs(id, countryId, otherId, lang);
  if (!model) notFound();

  const t = getTranslations(lang);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const vs = getVsStrings(lang);
  const {occupation, namesA, pair, v} = model;
  const pagePath = `${localePrefix}${vsPathFor(id, a, b)}`;

  const breadcrumbItems = [
    {label: t.nav?.home || tEn.nav.home, href: `${localePrefix}/`},
    {label: t.nav?.occupations || tEn.nav.occupations, href: `${localePrefix}/profile/occupation`},
    {label: cap(namesA.occPluralTitle), href: `${localePrefix}/profile/occupation/${id}`},
    {label: pair},
  ];

  const faqItems = buildVsFaq(model, lang, localePrefix);
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
      name: vs.combinedTitle(v),
      url: `${SITE_URL}${pagePath}`,
      numberOfItems: model.combined.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: model.combined.map(({person}, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: person.localizedName,
          url: `${SITE_URL}${localePrefix}/profile/person/${person.slug}`,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {"@type": "Answer", text: item.answer},
      })),
    },
  ];

  return (
    <div
      className="person occupation-country-page vs-page"
      style={{
        "--oc-accent": COLORS_DOMAIN[occupation.domain_slug] || "#9a3412",
        "--vs-b": VS_SIDE_B_COLORS[occupation.domain_slug] || "#2f6690",
      }}
    >
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(block).replace(/</g, "\\u003c")}}
        />
      ))}
      <VsHeader
        model={model}
        locale={lang}
        breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
      />
      <VsScoreboard model={model} locale={lang} />
      <VsMatchups model={model} locale={lang} />
      <VsCombined model={model} locale={lang} />
      <VsEras model={model} locale={lang} />
      <Faq items={faqItems} locale={lang} />
      <VsRelated model={model} locale={lang} />
    </div>
  );
}
