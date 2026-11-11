import Link from "next/link";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getVsLandingStrings} from "@/app/vsLandingTranslations";
import {buildCanonical, buildLanguageAlternates, localizePath} from "@/app/utils/hreflang";
import {vsPath} from "@/components/occupation-country/vs";
import {loadVsLanding, getFeaturedMatchups} from "@/components/vs-landing/data";
import MatchupPicker from "@/components/vs-landing/MatchupPicker";
import ArenaArt from "@/components/vs-landing/ArenaArt";
import "@/components/vs-landing/Landing.css";

const resolveLocale = locale => SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
export async function generateMetadata({params}) {
  const locale = resolveLocale((await params).locale);
  const t = getVsLandingStrings(locale);
  const title = `${t.metaTitle} | Pantheon`;
  const url = buildCanonical(locale, "/vs");
  return {
    title, description: t.description,
    alternates: {canonical: url, languages: buildLanguageAlternates("/vs")},
    openGraph: {title, description: t.description, url, type: "website", images: [{url: "https://pantheon.world/images/vs-social.png", width: 1200, height: 630, alt: t.title}]},
    twitter: {card: "summary_large_image", title, description: t.description, images: ["https://pantheon.world/images/vs-social.png"]},
  };
}

export default async function Page({params}) {
  const locale = resolveLocale((await params).locale);
  const t = getVsLandingStrings(locale);
  const occupations = await loadVsLanding(locale);
  const featured = getFeaturedMatchups(occupations);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: t.title, description: t.description, inLanguage: locale, url: buildCanonical(locale, "/vs"),
    mainEntity: {"@type": "ItemList", itemListElement: featured.map(({occupation, countryA, countryB}, index) => ({
      "@type": "ListItem", position: index + 1,
      name: `${occupation.name}: ${countryA.name} / ${countryB.name}`,
      url: buildCanonical(locale, vsPath(occupation.slug, countryA.slug, countryB.slug)),
    }))},
  };
  return <div className="vs-landing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")}}/>
    <header className="arena-hero">
      <div className="arena-hero-copy"><p className="arena-kicker"><span/> {t.kicker}</p><h1>{t.title}</h1><p className="arena-intro">{t.intro}</p></div>
      <ArenaArt/>
    </header>
    <div className="arena-builder"><MatchupPicker occupations={occupations} locale={locale} labels={t}/></div>
    {featured.length > 0 && <section className="arena-fixtures" aria-labelledby="fixtures-heading">
      <div className="arena-section-heading"><span className="arena-section-number" aria-hidden="true">01</span><div><h2 id="fixtures-heading">{t.featured}</h2><p>{t.featuredIntro}</p></div></div>
      <div className="arena-fixture-grid">{featured.map(({occupation, countryA, countryB}, index) => <Link prefetch={false} className="arena-fixture" key={occupation.slug} href={localizePath(locale, vsPath(occupation.slug, countryA.slug, countryB.slug))}>
        <div className="arena-fixture-top"><span>{occupation.name}</span><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
        <div className="arena-fixture-teams"><span>{countryA.name}</span><i aria-hidden="true">VS</i><span>{countryB.name}</span></div>
        <div className="arena-score-lines" aria-hidden="true"><span/><span/></div>
        <span className="arena-fixture-cta">{t.open}<span aria-hidden="true">↗</span></span>
      </Link>)}</div>
    </section>}
    <section className="arena-guide" aria-labelledby="guide-heading">
      <div className="arena-section-heading"><span className="arena-section-number" aria-hidden="true">02</span><h2 id="guide-heading">{t.how}</h2></div>
      <div className="arena-guide-grid">{[1, 2, 3].map(n => <article key={n}><span aria-hidden="true">{['Ⅰ', 'Ⅱ', 'Ⅲ'][n - 1]}</span><h3>{t[`step${n}`]}</h3><p>{t[`body${n}`]}</p></article>)}</div>
      <p className="arena-note">{t.note}</p>
    </section>
  </div>;
}
