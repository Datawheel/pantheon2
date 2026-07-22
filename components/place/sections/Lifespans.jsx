import SectionLayout from "../../common/SectionLayout";
import PeoplePriestley from "./vizes/PeoplePriestley";
import {getLocationTranslations} from "@/app/locationTranslations";

const Lifespans = ({attrs, place, peopleBorn, title, slug, lang = "en"}) => {
  const t = getLocationTranslations(lang);
  const tmapBornData = peopleBorn
    .filter(
      p => p.birthyear !== null && p.birthyear > 1699 && p.occupation !== null
    )
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
            location: place.place,
          })}
        </p>
        <PeoplePriestley
          title={t("lifespanTitle", {
            count: priestleyData.length,
            location: place.place,
          })}
          data={priestleyData}
          lang={lang}
        />
      </div>
    </SectionLayout>
  );
};

export default Lifespans;
