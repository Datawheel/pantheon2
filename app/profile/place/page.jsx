import { redirect } from "next/navigation";

export default async function Page({ params: { id } }) {
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
    "the-bronx",
    "dublin",
    "manhattan",
    "amsterdam",
    "houston",
    "sydney",
    "st-louis",
    "warsaw",
    "mexico-cityfederal-district",
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
    "kiev",
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
    "rosario-santa-fe",
    "neuilly-sur-seine",
    "johannesburg",
    "kansas-city-missouri",
    "bratislava",
    "honolulu",
    "sarajevo",
    "sparta",
    "oakland-california",
    "valencia",
    "lvivhabsburg-empire",
    "vilnius",
    "basel",
    "karlsruhe",
  ];
  const redirectSlug =
    placeCandidates[Math.floor(Math.random() * placeCandidates.length)];
  redirect(`/profile/place/${redirectSlug}`);
}
