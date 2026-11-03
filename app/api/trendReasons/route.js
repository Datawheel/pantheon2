import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {fetchTrendReasons} from "@/app/utils/trendReasons";
import {localizePersonGroups} from "@/app/utils/personLocalization";

const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
// The homepage grid shows 16 people; cap the lists so the PostgREST URLs stay short.
const MAX_PEOPLE = 16;

const parseList = value =>
  (value || "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, MAX_PEOPLE);

/**
 * Reader-language data for a trending grid showing another Wikipedia edition:
 * trend reasons written in `lang` for `slugs`, and `lang` display names for
 * the person `ids` (the edition's own article titles are in its language).
 */
export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const requestedLang = searchParams.get("lang");
  const lang = SUPPORTED_LOCALES.includes(requestedLang)
    ? requestedLang
    : DEFAULT_LOCALE;
  const slugs = parseList(searchParams.get("slugs"));
  const ids = parseList(searchParams.get("ids")).filter(id => /^\d+$/.test(id));

  const [reasons, [localizedPeople]] = await Promise.all([
    fetchTrendReasons({slugs, lang, baseApi: BASE_API}),
    localizePersonGroups([ids.map(id => ({id}))], lang, {baseApi: BASE_API}),
  ]);

  const names = Object.fromEntries(
    localizedPeople.filter(p => p.name).map(p => [p.id, p.name]),
  );

  return Response.json({reasons, names});
}
