import {nest} from "d3-collection";
import {plural} from "pluralize";
import AnchorList from "../../utils/AnchorList";
import SectionLayout from "../../common/SectionLayout";
import OccupationsTmap from "./vizes/OccupationsTmap";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getLocationTranslations} from "@/app/locationTranslations";

export default async function Occupations({
  attrs,
  place,
  peopleBorn,
  peopleDied,
  title,
  slug,
  lang = "en",
}) {
  const t = getLocationTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      occupation_name: d.occupation.occupation,
      occupation_id: `${d.occupation_id}`,
      place: d.bplace_geonameid,
      l: 0,
    }));

  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      industry: d.occupation.industry,
      domain: d.occupation.domain,
      occupation_name: d.occupation.occupation,
      occupation_id: `${d.occupation_id}`,
      place: d.dplace_geonameid,
    }));

  const occupationsBorn = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({
      num_born: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries(peopleBorn.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value);
  const occupationsDied = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({
      num_died: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries(peopleDied.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value);
  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          {t("mostBorn", {location: place.place})}&nbsp;
          <AnchorList
            items={occupationsBorn.slice(0, 5)}
            name={d =>
              `${lang === "en"
                ? plural(d.occupation.occupation.toLowerCase())
                : d.occupation.occupation} (${d.num_born})`
            }
            url={d => `${localePrefix}/profile/occupation/${d.occupation.occupation_slug}`}
            lang={lang}
          />
          ,&nbsp; {t("mostDied")}&nbsp;
          <AnchorList
            items={occupationsDied.slice(0, 5)}
            name={d =>
              `${lang === "en"
                ? plural(d.occupation.occupation.toLowerCase())
                : d.occupation.occupation} (${d.num_died})`
            }
            url={d => `${localePrefix}/profile/occupation/${d.occupation.occupation_slug}`}
            lang={lang}
          />
          .
        </p>
        {occupationsBorn.length ? (
          <OccupationsTmap
            attrs={attrs}
            data={tmapBornData}
            title={t("occupationsBornTitle", {location: place.place})}
            lang={lang}
          />
        ) : null}
        {occupationsDied.length ? (
          <OccupationsTmap
            attrs={attrs}
            data={tmapDeathData}
            title={t("occupationsDiedTitle", {location: place.place})}
            lang={lang}
          />
        ) : null}
      </div>
    </SectionLayout>
  );
}
