import SectionLayout from "../../common/SectionLayout";
import PeoplePriestley from "../../place/sections/vizes/PeoplePriestley";
import {getLocationTranslations} from "@/app/locationTranslations";

const Lifespans = ({attrs, country, peopleBorn, title, slug, lang = "en"}) => {
  const t = getLocationTranslations(lang);
  const safePeopleBorn = peopleBorn || [];
  const tmapBornData = safePeopleBorn
    .filter(p => p.birthyear !== null && p.birthyear > 1699 && p.occupation)
    .sort((a, b) => b.langs - a.langs)
    .map(d => ({
      ...d,
      occupation_name: d.occupation.occupation,
      occupation_id: `${d.occupation_id}`,
      place: d.birthplace,
    }));

  const priestleyMax = 25;

  const priestleyData = tmapBornData
    .filter(p => p.deathyear !== null)
    .slice(0, priestleyMax);

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="section-body">
        <p>
          {t("lifespanIntro", {
            count: priestleyData.length,
            location: country.country,
          })}
        </p>
        <PeoplePriestley
          title={t("lifespanTitle", {
            count: priestleyData.length,
            location: country.country,
          })}
          data={priestleyData}
          lang={lang}
        />
      </div>
    </SectionLayout>
  );
};

export default Lifespans;
