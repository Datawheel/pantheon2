"use client";

import AnchorList from "../utils/AnchorList";
import {toTitleCase} from "../utils/vizHelpers";
import {FORMATTERS} from "../utils/consts";
import "../common/Intro.css";
import "./Intro.css";
import {useRouter, useParams, usePathname} from "next/navigation";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import {useState} from "react";

const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function Intro({date, displayDate, month, day, people, lang = "en"}) {
  const t = getTranslations(lang);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const [selectedMonth, setSelectedMonth] = useState(parseInt(month, 10));
  const [selectedDay, setSelectedDay] = useState(parseInt(day, 10));

  // Determine locale
  const getLocale = () => {
    if (params?.locale && SUPPORTED_LOCALES.includes(params.locale)) {
      return params.locale;
    }
    const pathMatch = pathname?.match(
      new RegExp(`^/(${SUPPORTED_LOCALES.join("|")})(/|$)`),
    );
    if (pathMatch) {
      return pathMatch[1];
    }
    return DEFAULT_LOCALE;
  };

  const locale = getLocale();
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  // Sort people by HPI
  const peopleSortedByHPI = [...people].sort((a, b) => {
    if (!a.hpi && !b.hpi) return 0;
    if (!a.hpi) return 1;
    if (!b.hpi) return -1;
    return b.hpi - a.hpi;
  });

  // Count occupations (occupation is now a string)
  const occupationCounts = people.reduce((acc, person) => {
    if (person.occupation) {
      const key = person.occupation.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          occupation: person.occupation,
        };
      }
      acc[key].count++;
    }
    return acc;
  }, {});

  const topOccupations = Object.values(occupationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const handleDateChange = () => {
    const newMonth = String(selectedMonth).padStart(2, "0");
    const newDay = String(selectedDay).padStart(2, "0");
    router.push(
      `${localePrefix}/profile/born-on-this-day/${newMonth}-${newDay}`,
    );
  };

  const goToToday = () => {
    const today = new Date();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDay = String(today.getDate()).padStart(2, "0");
    router.push(
      `${localePrefix}/profile/born-on-this-day/${todayMonth}-${todayDay}`,
    );
  };

  // Navigate to previous/next day
  const navigateDay = direction => {
    const currentDate = new Date(
      2024,
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
    currentDate.setDate(currentDate.getDate() + direction);
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const newDay = String(currentDate.getDate()).padStart(2, "0");
    router.push(
      `${localePrefix}/profile/born-on-this-day/${newMonth}-${newDay}`,
    );
  };

  // Get localized month names
  const getMonthName = (idx) => {
    const key = MONTH_KEYS[idx];
    return t.bornOnThisDay?.months?.[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <section className="intro-section born-on-this-day">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" alt="Birthday icon" />
          </h3>
          <p>
            {t.bornOnThisDay?.birthdayOf?.({displayDate, count: people.length}) ||
              `${displayDate} is the birthday of ${FORMATTERS.commas(people.length)} celebrities and historically significant ${people.length === 1 ? "person" : "people"} in the Pantheon database.`}
            {peopleSortedByHPI.length > 0 && (
              <>
                {" "}
                {t.bornOnThisDay?.mostFamousInclude || "The most famous include"}{" "}
                <AnchorList
                  items={peopleSortedByHPI.slice(0, 5)}
                  name={d => d.name}
                  url={d => `${localePrefix}/profile/person/${d.slug}/`}
                />
                .
              </>
            )}
            {topOccupations.length > 0 && (
              <>
                {" "}
                {t.bornOnThisDay?.mostCommonOccupations || "The most common occupations for people born on this day are"}{" "}
                {topOccupations.map((d, i) => (
                  <span key={d.occupation}>
                    {i > 0 &&
                      (i === topOccupations.length - 1 ? ", and " : ", ")}
                    <strong>{toTitleCase(d.occupation)}</strong> ({d.count})
                  </span>
                ))}
                .
              </>
            )}
          </p>
        </div>
      </div>

      <div className="date-picker-section">
        <h4>{t.bornOnThisDay?.exploreAnotherDate || "Explore Another Date"}</h4>
        <div className="date-picker-controls">
          <select
            value={selectedMonth}
            onChange={e => {
              const newMonth = parseInt(e.target.value, 10);
              setSelectedMonth(newMonth);
              // Adjust day if it exceeds days in new month
              if (selectedDay > DAYS_IN_MONTH[newMonth - 1]) {
                setSelectedDay(DAYS_IN_MONTH[newMonth - 1]);
              }
            }}
            className="date-select"
          >
            {MONTH_KEYS.map((key, idx) => (
              <option key={idx} value={idx + 1}>
                {getMonthName(idx)}
              </option>
            ))}
          </select>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(parseInt(e.target.value, 10))}
            className="date-select"
          >
            {Array.from(
              {length: DAYS_IN_MONTH[selectedMonth - 1]},
              (_, i) => i + 1,
            ).map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button onClick={handleDateChange} className="date-go-btn">
            {t.bornOnThisDay?.go || "Go"}
          </button>
          <button onClick={goToToday} className="date-today-btn">
            {t.bornOnThisDay?.today || "Today"}
          </button>
        </div>
      </div>

      <div className="day-navigation">
        <button onClick={() => navigateDay(-1)} className="day-nav-btn">
          &laquo; {t.bornOnThisDay?.previousDay || "Previous Day"}
        </button>
        <button onClick={() => navigateDay(1)} className="day-nav-btn">
          {t.bornOnThisDay?.nextDay || "Next Day"} &raquo;
        </button>
      </div>
    </section>
  );
}
