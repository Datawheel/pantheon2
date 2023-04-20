import SectionLayout from "../../common/SectionLayout";
import PeoplePriestley from "../../place/sections/vizes/PeoplePriestley";

const Lifespans = ({ attrs, country, peopleBorn, title, slug }) => {
  const tmapBornData = peopleBorn
    .filter((p) => p.birthyear !== null && p.birthyear > 1699 && p.occupation)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach((d) => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.birthplace;
  });

  const priestleyMax = 25;

  const priestleyData = tmapBornData
    .filter((p) => p.deathyear !== null)
    .slice(0, priestleyMax);

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="section-body">
        <p>
          Below is a visual represetation of the lifespans of the top{" "}
          {priestleyData.length} globally memorable people born in present day{" "}
          {country.country} since 1700.
        </p>
        <PeoplePriestley
          attrs={attrs}
          title={`Lifespans of Top ${priestleyData.length} Individuals Born in ${country.country}`}
          data={priestleyData}
        />
      </div>
    </SectionLayout>
  );
};

export default Lifespans;
