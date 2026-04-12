import PeopleGrid from "./PeopleGrid";
import "../common/Section.css";
import AnchorList from "../utils/AnchorList";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";

export default function PeopleSection({date, displayDate, people, lang = "en"}) {
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const t = getTranslations(lang);

  // Sort by HPI
  const peopleSortedByHPI = [...people].sort((a, b) => {
    if (!a.hpi && !b.hpi) return 0;
    if (!a.hpi) return 1;
    if (!b.hpi) return -1;
    return b.hpi - a.hpi;
  });

  // Get some notable people for the intro text
  const topPeople = peopleSortedByHPI.slice(0, 3);

  // Calculate some interesting stats
  const livingPeople = people.filter(p => p.alive !== false && !p.deathyear);
  const historicalPeople = people.filter(p => p.alive === false || p.deathyear);

  return (
    <section className="profile-section">
      <h2>{t.bornOnThisDay?.famousPeopleBornOn?.({displayDate}) || `Famous People Born on ${displayDate}`}</h2>
      <div className="section-body">
        <p>
          {t.bornOnThisDay?.discoverRemarkable?.({displayDate}) ||
            `Discover the remarkable individuals who share ${displayDate} as their birthday. From world leaders and groundbreaking scientists to beloved entertainers and legendary athletes, this day has seen the birth of many influential figures throughout history.`}
          {topPeople.length > 0 && (
            <>
              {" "}{t.bornOnThisDay?.someNotableInclude || "Some of the most notable include"}{" "}
              <AnchorList
                items={topPeople}
                name={d => d.name}
                url={d => `${localePrefix}/profile/person/${d.slug}/`}
              />
              .
            </>
          )}
          {livingPeople.length > 0 && historicalPeople.length > 0 && (
            <>
              {" "}{t.bornOnThisDay?.stillLivingToday?.({total: people.length, living: livingPeople.length}) ||
                `Of the ${people.length} famous people born on this date, ${livingPeople.length} are still living today.`}
            </>
          )}
        </p>
      </div>
      <PeopleGrid
        bios={peopleSortedByHPI.slice(0, 20)}
        date={date}
        lang={lang}
      />
    </section>
  );
}
