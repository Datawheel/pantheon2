import Image from "next/image";
import {cutoutSrc, portraitId, countryPortraitIds} from "@/components/occupation-country/vs/portraits";
import Link from "next/link";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getVsStrings} from "@/app/occupationCountryVsTranslations";
import {getVsLandingStrings} from "@/app/vsLandingTranslations";
import {buildCanonical, buildLanguageAlternates, localizePath} from "@/app/utils/hreflang";
import {vsPath} from "@/components/occupation-country/vs";
import {loadVsLanding, getFeaturedMatchups, HERO_MATCHUPS} from "@/components/vs-landing/data";
import {occupationPluralFor} from "@/app/occupationCountryTranslations";
import MatchupPicker from "@/components/vs-landing/MatchupPicker";
import ArenaShowcase from "@/components/vs-landing/ArenaShowcase";
import {vsBackdrop} from "@/components/occupation-country/vs/backdrop";
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
  const {occupations, allCountries} = await loadVsLanding(locale);
  const featured = getFeaturedMatchups(occupations, allCountries);
  const vs = getVsStrings(locale).vs;
  const fixtureImages = ({occupation, countryA, countryB}) => [countryA, countryB].map(country => {
    const id = occupation ? portraitId(occupation.slug, country.slug) : countryPortraitIds(country.slug)[0];
    return id ? cutoutSrc(id) : null;
  });
  const toSlide = fixture => ({
    href: localizePath(locale, vsPath(fixture.occupation?.slug, fixture.countryA.slug, fixture.countryB.slug)),
    field: fixture.occupation ? occupationPluralFor(fixture.occupation.slug, fixture.occupation.name, locale) : t.all,
    names: [fixture.countryA.name, fixture.countryB.name],
    images: fixtureImages(fixture),
    style: vsBackdrop(fixture.occupation?.domain),
  });
  const slides = featured.map(toSlide);
  const showcase = getFeaturedMatchups(occupations, allCountries, HERO_MATCHUPS).map(toSlide);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: t.title, description: t.description, inLanguage: locale, url: buildCanonical(locale, "/vs"),
    mainEntity: {"@type": "ItemList", itemListElement: featured.map(({occupation, countryA, countryB}, index) => ({
      "@type": "ListItem", position: index + 1,
      name: `${occupation?.name || t.all}: ${countryA.name} / ${countryB.name}`,
      url: buildCanonical(locale, vsPath(occupation?.slug, countryA.slug, countryB.slug)),
    }))},
  };
  return <div className="vs-landing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")}}/>
    <header className="arena-hero">
      <div className="arena-hero-copy"><p className="arena-kicker"><span/> {t.kicker}</p><h1>{t.title}</h1><p className="arena-intro">{t.intro}</p></div>
      <ArenaShowcase slides={showcase} labels={{...t, vs}}/>
    </header>
    <div className="arena-builder"><MatchupPicker allCountries={allCountries} occupations={occupations} locale={locale} labels={t}/></div>
    {featured.length > 0 && <section className="arena-fixtures" aria-labelledby="fixtures-heading">
      <div className="arena-section-heading"><span className="arena-section-number" aria-hidden="true">01</span><div><h2 id="fixtures-heading">{t.featured}</h2><p>{t.featuredIntro}</p></div></div>
      <div className="arena-fixture-grid">{featured.map((fixture, index) => {
        const {occupation, countryA, countryB} = fixture;
        return <Link prefetch={false} className="arena-fixture" key={vsPath(occupation?.slug, countryA.slug, countryB.slug)} href={slides[index].href} style={slides[index].style}>
        <div className="arena-fixture-art" aria-hidden="true">
          {fixtureImages(fixture).map(src => src && <Image key={src} src={src} alt="" width={140} height={140} unoptimized/>)}
        </div>
        <div className="arena-fixture-top">{occupation?.name || t.all}</div>
        <div className="arena-fixture-teams"><span>{countryA.name}</span><i>{vs}</i><span>{countryB.name}</span></div>
        <span className="arena-fixture-cta">{t.open}<span aria-hidden="true">↗</span></span>
      </Link>;
      })}</div>
    </section>}
    <section className="arena-guide" aria-labelledby="guide-heading">
      <div className="arena-section-heading"><span className="arena-section-number" aria-hidden="true">02</span><h2 id="guide-heading">{t.how}</h2></div>
      <div className="arena-guide-grid">{[1, 2, 3].map(n => <article key={n}><span aria-hidden="true">{['Ⅰ', 'Ⅱ', 'Ⅲ'][n - 1]}</span><h3>{t[`step${n}`]}</h3><p>{t[`body${n}`]}</p></article>)}</div>
      <p className="arena-note">{t.note}</p>
    </section>
  </div>;
}
