import {redirect} from "next/navigation";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "/app/locales";
import {safeFetchFirst} from "/app/utils/safeFetch";

async function isValidPlaceSlug(slug) {
  if (!slug) return false;
  const url = `${BASE_API}/place?slug=eq.${slug}&select=slug`;
  const data = await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}},
    null
  );
  return Boolean(data && data.slug);
}

export default async function Page({params}) {
  const locale =
    params && SUPPORTED_LOCALES.includes(params.locale)
      ? params.locale
      : DEFAULT_LOCALE;
  const placeCandidates = [
    "new-york-city",
    "paris",
    "london",
    "rome",
    "los-angeles",
    "moscow",
    "chicago",
    "vienna",
    "brooklyn",
    "berlin",
    "saint-petersburg",
    "budapest",
    "madrid",
    "philadelphia",
    "tokyo",
    "buenos-aires",
    "prague",
    "stockholm",
    "seoul",
    "copenhagen",
    "boston",
    "munich",
    "washington-dc",
    "barcelona",
    "florence",
    "rio-de-janeiro",
    "sao-paulo",
    "milan",
    "san-francisco",
    "athens",
    "venice",
    "detroit",
    "mumbai",
    "istanbul",
    "montevideo",
    "toronto",
    "dublin",
    "manhattan",
    "amsterdam",
    "houston",
    "sydney",
    "st-louis",
    "warsaw",
    "tbilisi",
    "hamburg",
    "belgrade",
    "montreal",
    "baltimore",
    "melbourne",
    "lisbon",
    "oslo",
    "glasgow",
    "naples",
    "kyiv",
    "istanbul",
    "dallas",
    "bucharest",
    "cairo",
    "pittsburgh",
    "bologna",
    "cleveland",
    "lyon",
    "turin",
    "frankfurt",
    "kyoto",
    "atlanta",
    "riga",
    "san-diego",
    "zagreb",
    "santiago",
    "alexandria",
    "edinburgh",
    "tehran",
    "dresden",
    "new-orleans",
    "liverpool",
    "seattle",
    "vancouver",
    "helsinki",
    "tallinn",
    "shizuoka-city",
    "marseillehistory",
    "geneva",
    "miami",
    "stuttgart",
    "brussels",
    "queens",
    "baku",
    "santa-monica-california",
    "the-hague",
    "mecca",
    "cologne",
    "jerusalem",
    "split-croatia",
    "cincinnati",
    "rotterdam",
    "lima",
    "krakow",
    "gothenburg",
    "leipzig",
    "yokohama",
    "beijing",
    "reykjavik",
    "shizuoka-prefecture",
    "odessa",
    "hanover",
    "zurich",
    "antwerp",
    "newark-new-jersey",
    "portland-oregon",
    "milwaukee",
    "wroclaw",
    "memphis-tennessee",
    "ljubljana",
    "saitama-city",
    "minsk",
    "denver",
    "baghdad",
    "asuncion",
    "sofia",
    "shanghai",
    "genoa",
    "minneapolis",
    "indianapolis",
    "seville",
    "birmingham",
    "columbus-ohio",
    "strasbourg",
    "kolkata",
    "kanagawa-prefecture",
    "buffalo-new-york",
    "konigsberg",
    "neuilly-sur-seine",
    "johannesburg",
    "kansas-city-missouri",
    "bratislava",
    "honolulu",
    "sarajevo",
    "sparta",
    "oakland-california",
    "valencia",
    "vilnius",
    "basel",
    "karlsruhe",
  ];

  let redirectSlug = null;
  const maxAttempts = Math.min(8, placeCandidates.length);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate =
      placeCandidates[Math.floor(Math.random() * placeCandidates.length)];
    // eslint-disable-next-line no-await-in-loop
    const valid = await isValidPlaceSlug(candidate);
    if (valid) {
      redirectSlug = candidate;
      break;
    }
  }

  if (!redirectSlug) {
    redirectSlug = "paris";
  }

  redirect(`/${locale}/profile/place/${redirectSlug}`);
}
