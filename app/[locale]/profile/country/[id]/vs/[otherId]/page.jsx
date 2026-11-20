import {cache} from "react";
import {notFound, permanentRedirect} from "next/navigation";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import PersonImage from "@/components/utils/PersonImage";
import {OccupationAnalysis, PlaceAnalysis} from "@/components/country/vs/CountryAnalysis";
import {countryComparison} from "@/components/country/vs/data";
import {VsMore, VsPoster, VsMatchups, VsScoreboard} from "@/components/occupation-country/vs/VsSections";
import {vsPath, vsSlugs} from "@/components/occupation-country/vs";
import {cutoutSrc} from "@/components/occupation-country/vs/portraits";
import {vsBackdrop} from "@/components/occupation-country/vs/backdrop";
import {countryComparisonLead, getVsLandingStrings} from "@/app/vsLandingTranslations";
import {getVsStrings} from "@/app/occupationCountryVsTranslations";
import {englishCountry} from "@/app/occupationCountryTranslations";
import {getTranslations} from "@/app/translations";
import {SUPPORTED_LOCALES} from "@/app/locales";
import {buildCanonical, localizePath, buildLanguageAlternates} from "@/app/utils/hreflang";
import "@/components/country/vs/CountryVs.css";

const load = cache(async (locale, id, otherId) => {
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  if (id === otherId) permanentRedirect(localizePath(locale, `/profile/country/${id}`));
  const [a, b] = vsSlugs(id, otherId);
  const path = vsPath(null, a, b);
  if (a !== id) permanentRedirect(localizePath(locale, path));
  const model = await countryComparison(a, b, locale);
  if (!model) notFound();
  return {path, model};
});

export async function generateMetadata({params}) {
  const {locale, id, otherId} = await params;
  const {path, model} = await load(locale, id, otherId);
  const t = getVsLandingStrings(locale);
  const title = `${model.pair} · ${t.peopleTitle} | Pantheon`;
  const description = `${model.pair} · ${countryComparisonLead(locale, model.sides)}`;
  const url = buildCanonical(locale, path);
  const query = new URLSearchParams({a: id, b: otherId, lang: locale});
  const alt = [model.pair, ...model.sides.map(side => side.people[0]?.localizedName)].filter(Boolean).join(" · ");
  const images = [{url: buildCanonical("en", `/api/screenshot/country-vs?${query}`), width: 1200, height: 630, type: "image/png", alt}];
  return {title, description, alternates: {canonical: url, languages: buildLanguageAlternates(path)},
    openGraph: {type: "website", url, title, description, images},
    twitter: {card: "summary_large_image", title, description, images}};
}

export default async function Page({params}) {
  const {locale, id, otherId} = await params;
  const {path, model} = await load(locale, id, otherId);
  const t = getVsLandingStrings(locale);
  const vs = getVsStrings(locale);
  const crumbs = [
    {label: getTranslations(locale).nav.home, href: localizePath(locale, "/")},
    {label: t.nav, href: localizePath(locale, "/vs")},
    {label: model.pair},
  ];
  const url = buildCanonical(locale, path);
  const schema = {"@context": "https://schema.org", "@type": "CollectionPage", url,
    name: model.pair, inLanguage: locale,
    about: model.sides.map(s => ({"@type": "Country", name: s.label, url: buildCanonical(locale, s.path)})),
    breadcrumb: {"@type": "BreadcrumbList", itemListElement: crumbs.map((c,i) => ({
      "@type": "ListItem", position: i + 1, name: c.label, item: c.href ? new URL(c.href, url).href : url,
    }))}};
  return (
    <div className="person occupation-country-page vs-page country-vs" style={vsBackdrop(null)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g, "\\u003c")}}/>
      <VsPoster className="country-poster" breadcrumbs={<Breadcrumbs items={crumbs}/>} pair={model.pair}
        kicker={t.peopleTitle} countLabel={vs.rowCount} localePrefix={localizePath(locale, "")} sides={model.sides}>
        <div className="country-collage">
          {model.sides.map(side => <div className="country-lineup" key={side.path}>
            {side.portraits.map(person => <a key={person.id} href={localizePath(locale, `/profile/person/${person.slug}`)}
              title={person.localizedName} aria-label={person.localizedName}>
              <PersonImage className={person.cutout ? "vs-cutout" : "vs-photo"} person={person} wrap={false} alt=""
                src={person.cutout ? cutoutSrc(person.id) : `/profile/people/${person.id}.jpg`}/>
            </a>)}
          </div>)}
        </div>
      </VsPoster>
      <VsScoreboard locale={locale} model={model} summary={`${countryComparisonLead(locale, model.sides)} ${t.summary}`}/>
      <OccupationAnalysis sides={model.sides} locale={locale}/>
      <PlaceAnalysis sides={model.sides} locale={locale}/>
      <VsMatchups locale={locale} model={model}/>
      <VsMore
        locale={locale}
        fieldsTitle={getTranslations(locale).nav.occupations}
        fields={model.sharedFields.map(field => ({...field, key: field.slug, href: vsPath(field.slug, id, otherId)}))}
        rivals={model.sides.map((side, i) => ({
          key: i ? "b" : "a", name: side.label, links: i ? model.rivalsB : model.rivalsA,
          title: vs.moreTitle({X: side.label, XThe: locale === "en" ? englishCountry(side.country.country) : side.label}),
        }))}
        listsTitle={vs.fullListsTitle}
        lists={[...model.sides.map(side => ({key: side.path, href: side.path, label: side.label})),
          {key: "vs", href: "/vs", label: t.nav}]}
      />
    </div>
  );
}
