import { plural } from "pluralize";
import SectionLayout from "../../common/SectionLayout";
import PeoplePriestley from "../../place/sections/vizes/PeoplePriestley";
import { toTitleCase } from "../../utils/vizHelpers";

const Lifespans = ({ attrs, occupation, people, title, slug }) => {
  people = people
    .filter((p) => p.birthyear && p.occupation)
    .sort((a, b) => b.birthyear - a.birthyear);

  const tmapBornData = people
    .filter(
      (p) =>
        p.birthyear !== null &&
        p.birthyear > 1699 &&
        p.bplace_country &&
        p.bplace_country.country &&
        p.bplace_country.continent &&
        p.dplace_country &&
        p.dplace_country.country &&
        p.dplace_country.continent
    )
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach((d) => {
    d.borncountry = d.bplace_country.country_name;
    d.borncontinent = d.bplace_country.continent;
    d.diedcontinent = d.dplace_country.continent;
  });

  const priestleyMax = 25;

  const priestleyData = tmapBornData
    .filter((p) => p.deathyear !== null && p.dplace_country !== null)
    .slice(0, priestleyMax);

  if (priestleyData.length < 3) {
    return null;
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="section-body">
        <p>
          Which {toTitleCase(plural(occupation.occupation))} were alive at the
          same time? This visualization shows the lifespans of the{" "}
          {priestleyData.length} most globally memorable{" "}
          {toTitleCase(plural(occupation.occupation))} since 1700.
        </p>
        <PeoplePriestley
          attrs={attrs}
          title={`Lifespans of the Top ${priestleyData.length} ${toTitleCase(
            plural(occupation.occupation)
          )}`}
          data={priestleyData}
        />
      </div>
    </SectionLayout>
  );
};

export default Lifespans;
