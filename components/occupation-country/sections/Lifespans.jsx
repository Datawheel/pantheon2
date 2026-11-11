import SectionLayout from "../../common/SectionLayout";
import PeoplePriestley from "../../place/sections/vizes/PeoplePriestley";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getOcStrings} from "@/app/occupationCountryTranslations";

const MAX = 25;

export default function Lifespans({people, occupation, locale = DEFAULT_LOCALE}) {
  const s = getOcStrings(locale);
  const domain =
    occupation.translations?.[locale]?.domain ||
    occupation.translations?.en?.domain ||
    occupation.domain;

  // Only the fields the chart reads, so the client payload stays small.
  const data = people
    .filter(person => {
      const hasDeath = Number.isFinite(person.deathyear);
      const living = person.alive === true && !hasDeath;
      return Number.isFinite(person.birthyear) && person.birthyear > 1699 && (hasDeath || living);
    })
    .slice(0, MAX)
    .map(person => ({
      name: person.localizedName,
      slug: person.slug,
      birthyear: person.birthyear,
      deathyear: person.deathyear,
      alive: person.alive,
      occupation: {domain, domain_slug: occupation.domain_slug},
    }));

  if (data.length < 3) return null;
  const params = {lifeCount: data.length};

  return (
    <SectionLayout slug="overlapping-lives" title={s.lifespansTitle}>
      <div className="section-body">
        <p>{s.lifespansIntro(params)}</p>
        <PeoplePriestley title={s.lifespansChartTitle(params)} data={data} lang={locale} />
      </div>
    </SectionLayout>
  );
}
