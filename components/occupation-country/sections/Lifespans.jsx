import {plural} from "pluralize";
import SectionLayout from "../../common/SectionLayout";
import PeoplePriestley from "../../place/sections/vizes/PeoplePriestley";
import {toTitleCase} from "../../utils/vizHelpers";

const Lifespans = ({attrs, occupation, people, title, slug}) => {
  const eligiblePeople = people
    .filter(
      person => {
        const hasKnownDeathYear = Number.isFinite(person.deathyear);
        const isLiving = person.alive === true && !hasKnownDeathYear;

        return (
          Number.isFinite(person.birthyear) &&
          person.birthyear > 1699 &&
          person.occupation &&
          (hasKnownDeathYear || isLiving)
        );
      }
    )
    .sort((a, b) => (b.hpi ?? b.l ?? 0) - (a.hpi ?? a.l ?? 0));

  const priestleyMax = 25;
  const priestleyData = eligiblePeople.slice(0, priestleyMax);

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
