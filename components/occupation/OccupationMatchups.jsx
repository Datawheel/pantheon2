import {getTranslations} from "@/app/translations";
import {getVsLandingStrings} from "@/app/vsLandingTranslations";
import {formatPair} from "@/app/occupationCountryVsTranslations";
import {FEATURED_MATCHUPS} from "@/components/vs-landing/data";
import {VS_MIN_PEOPLE, vsPath, vsSlugs} from "@/components/occupation-country/vs";
import {VsMore} from "@/components/occupation-country/vs/VsSections";
import CountryPairPicker from "./CountryPairPicker";
import "./Matchups.css";

export default function OccupationMatchups({occupation, rows, locale}) {
  const countries = rows.filter(row => row.country_slug && row.num_people >= VS_MIN_PEOPLE)
    .map(row => ({slug: row.country_slug, name: row.country_data?.[`${locale}_country`] || row.country,
      count: row.num_people}))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
  if (countries.length < 2) return null;

  const occupationSlug = occupation.occupation_slug;
  const bySlug = new Map(countries.map(c => [c.slug, c]));
  const tiles = new Map();
  function addPair(first, second) {
    if (!first || !second) return;
    const [a, b] = vsSlugs(first.slug, second.slug).map(slug => bySlug.get(slug));
    const href = vsPath(occupationSlug, a.slug, b.slug);
    tiles.set(href, {key: href, href, label: formatPair(a.name, b.name, locale),
      domain: occupation.domain_slug, counts: [a.count, b.count]});
  }
  for (const [field, a, b] of FEATURED_MATCHUPS) {
    if (field === occupationSlug) addPair(bySlug.get(a), bySlug.get(b));
  }
  addPair(countries[0], countries[1]);
  // Among the leading eight, neighboring counts contain the closest matchup.
  const contenders = countries.slice(0, 8);
  const closePairs = contenders.slice(1).map((c, i) => [contenders[i], c])
    .sort(([a, b], [c, d]) => d.count / c.count - b.count / a.count);
  addPair(...closePairs[0]);
  addPair(countries[1], countries[2]);
  addPair(countries[2], countries[3]);

  const labels = getVsLandingStrings(locale);
  return <VsMore fieldsTitle={getTranslations(locale).occupationCountry?.keepExploring || labels.compare}
    fields={[...tiles.values()]} locale={locale}>
    <CountryPairPicker key={occupationSlug} countries={countries} occupation={occupationSlug} locale={locale}
      labels={{build: labels.build, a: labels.countryA, b: labels.countryB, compare: labels.compare}}/>
  </VsMore>;
}
