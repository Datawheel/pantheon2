"use client";

import {useState} from "react";
import {plural} from "pluralize";
import PersonImage from "@/components/utils/PersonImage";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {toTitleCase} from "@/components/utils/vizHelpers";
import "../../born-on-this-day/OccupationBreakdown.css";
import "../../common/Section.css";
import "./BirthDecades.css";

function getDecade(year) {
  if (!year || Number.isNaN(Number(year))) return null;
  return Math.floor(Number(year) / 10) * 10;
}

export default function BirthDecades({
  people = [],
  country,
  occupation,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  const occupationPlural =
    locale === "en"
      ? toTitleCase(plural(occupation.occupation))
      : occupation.occupation;

  const [expandedGroups, setExpandedGroups] = useState({});

  if (!people.length || people.length <= 10) return null;

  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const grouped = people.reduce((acc, person) => {
    const decade = getDecade(person.birthyear);
    const key = decade ? `${decade}` : "unknown";
    if (!acc[key]) {
      acc[key] = {
        decade,
        people: [],
      };
    }
    acc[key].people.push(person);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped)
    .map(([key, group]) => ({
      key,
      decade: group.decade,
      people: group.people.sort((a, b) => (b.hpi || 0) - (a.hpi || 0)),
    }))
    .sort((a, b) => {
      if (!a.decade && !b.decade) return 0;
      if (!a.decade) return 1;
      if (!b.decade) return -1;
      return b.decade - a.decade;
    });

  return (
    <section className="profile-section occupation-breakdown occupation-decades">
      <h2>{tc.birthDecadesTitle || "People by Birth Decade"}</h2>
      <div className="section-body">
        <p>
          {tc.birthDecadesIntro?.({
            demonym: country.demonym,
            occupationPlural,
          }) ||
            `Browse notable ${country.demonym} ${occupationPlural} grouped by birth decade. Each decade shows the top 10 by HPI; expand to see everyone.`}
        </p>
      </div>

      <div className="occupation-groups">
        {sortedGroups.map(({key, decade, people: groupPeople}) => {
          const isExpanded = expandedGroups[key];
          const displayPeople = isExpanded ? groupPeople : groupPeople.slice(0, 10);
          const remainingCount = groupPeople.length - 10;
          const label = decade
            ? (tc.decadeLabel?.({decade}) || `${decade}s`)
            : (t.unknown || "Unknown");

          return (
            <div key={key} className="occupation-group">
              <h3 className="occupation-group__title">
                <span>{label}</span>
                <span className="occupation-group__count">({groupPeople.length})</span>
              </h3>
              <div className="occupation-group__people">
                {displayPeople.map(person => (
                  <a
                    key={person.id}
                    href={`${localePrefix}/profile/person/${person.slug}`}
                    className="occupation-person"
                    title={person.name}
                  >
                    <PersonImage
                      src={`/profile/people/${person.id}.jpg`}
                      alt={person.name}
                      fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                    />
                    <span className="occupation-person__name">{person.name}</span>
                  </a>
                ))}
                {groupPeople.length > 10 && (
                  <button
                    className="occupation-group__more"
                    onClick={() => toggleGroup(key)}
                  >
                    {isExpanded
                      ? (tc.showLess || "Show less")
                      : (tc.more?.({count: remainingCount}) || `+${remainingCount} more`)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
