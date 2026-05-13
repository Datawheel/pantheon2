"use client";

import {max as d3Max, min as d3Min} from "d3-array";
import dayjs from "dayjs";
import {useEffect, useMemo, useState} from "react";
import SimpleTooltip from "../common/SimpleTooltip";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import {getLocalizedLanguageName} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import PageViewsChart from "./PageViewsChart";
import "../../styles/Header.css";
import "../../styles/mouse.css";

function getBirthdayParts(person = {}) {
  const birthMonth = Number(person.birthmonth);
  const birthDay = Number(person.birthday);

  if (
    Number.isInteger(birthMonth) &&
    Number.isInteger(birthDay) &&
    birthMonth >= 1 &&
    birthMonth <= 12 &&
    birthDay >= 1 &&
    birthDay <= 31
  ) {
    return {month: birthMonth, day: birthDay};
  }

  if (person.birthdate) {
    const parsed = dayjs(person.birthdate);
    if (parsed.isValid()) {
      return {month: parsed.month() + 1, day: parsed.date()};
    }
  }

  return null;
}

function isBirthdayToday(person = {}) {
  const birthdayParts = getBirthdayParts(person);
  if (!birthdayParts) {
    return false;
  }

  const today = new Date();
  return (
    birthdayParts.month === today.getMonth() + 1 &&
    birthdayParts.day === today.getDate()
  );
}

function getPossessiveName(name = "") {
  if (!name) {
    return "";
  }
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

export default function Header({
  person,
  trendingData = {},
  currentLang = "en",
  pageViews = [],
}) {
  const t = getTranslations(currentLang);
  const [showBirthdayCelebration, setShowBirthdayCelebration] = useState(false);
  const [isBirthdayPerson, setIsBirthdayPerson] = useState(false);
  const confettiPieces = useMemo(() => {
    const palette = [
      "#f06c6c",
      "#f4b942",
      "#4caf50",
      "#3b82f6",
      "#9b5de5",
      "#ff5fa2",
    ];
    return Array.from({length: 80}, (_, index) => ({
      id: `confetti-${index}`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
      duration: `${3.2 + Math.random() * 2.8}s`,
      drift: `${Math.round(Math.random() * 140 - 70)}px`,
      rotate: `${Math.round(Math.random() * 360)}deg`,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));
  }, []);

  useEffect(() => {
    setIsBirthdayPerson(isBirthdayToday(person));
  }, [person]);

  useEffect(() => {
    if (!isBirthdayPerson) {
      setShowBirthdayCelebration(false);
      return undefined;
    }

    setShowBirthdayCelebration(true);
    const hideTimer = setTimeout(() => setShowBirthdayCelebration(false), 9000);
    return () => clearTimeout(hideTimer);
  }, [isBirthdayPerson, person.id]);

  // const {items: wikiPageViews} = await getWikiPageViews(person.name);
  const wikiPageViews = null;
  // const isTrendingData = await getIsTrending(person.id);
  // const isTrending = !!isTrendingData.length;

  let pageViewData = null;
  if (wikiPageViews) {
    // Need to chop off the last month since it is incomplete
    pageViewData = wikiPageViews.slice(0, wikiPageViews.length - 1).map(pv => ({
      ...pv,
      date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(
        4,
        6,
      )}/${pv.timestamp.substring(6, 8)}`,
    }));
    const mostRecentDate = d3Max(pageViewData, d =>
      dayjs(d.date, "YYYY/MM/DD"),
    );
    const oldestDate = d3Min(pageViewData, d => dayjs(d.date, "YYYY/MM/DD"));
    pageViewData.push({
      ...pageViewData.find(d => d.date === oldestDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
    pageViewData.push({
      ...pageViewData.find(d => d.date === mostRecentDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
  }

  const backgroundColor = person.occupation
      ? COLORS_DOMAIN[person.occupation.domain_slug]
      : "",
    backgroundImage = `url('https://static.pantheon.world/profile/people/${person.wp_id}.jpg')`;

  return (
    <header className="hero">
      {showBirthdayCelebration ? (
        <>
          <div className="birthday-toast" role="status" aria-live="polite">
            {t.birthdayToast?.({
              name: person.name,
              possessiveName: getPossessiveName(person.name),
            }) || `Today is ${getPossessiveName(person.name)} birthday`}
          </div>
          <div className="birthday-confetti" aria-hidden>
            {confettiPieces.map(piece => (
              <span
                className="birthday-confetti-piece"
                key={piece.id}
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  backgroundColor: piece.color,
                  "--confetti-drift": piece.drift,
                  "--confetti-rotate": piece.rotate,
                }}
              />
            ))}
          </div>
        </>
      ) : null}
      <div className="bg-container">
        <div className="bg-img-mask person" style={{backgroundColor}}>
          <div
            className="bg-img bg-img-l"
            style={{backgroundColor, backgroundImage}}
          ></div>
          <div
            className="bg-img bg-img-r"
            style={{backgroundColor, backgroundImage}}
          ></div>
        </div>
      </div>
      <div className="info">
        {/* Language rank badges */}
        {trendingData.isTrending && trendingData.ranksByLang && (
          <div className="language-rank-badges-header">
            {Object.entries(trendingData.ranksByLang)
              .sort(([langA, rankA], [langB, rankB]) => {
                if (langA === currentLang) return -1;
                if (langB === currentLang) return 1;
                return rankA - rankB;
              })
              .slice(0, 5)
              .map(([langCode, rank]) => (
                <SimpleTooltip
                  key={langCode}
                  content={`Rank #${rank} in ${getLocalizedLanguageName(langCode, currentLang)}`}
                >
                  <div
                    className={`lang-rank-badge ${langCode === currentLang ? "current-lang" : ""}`}
                  >
                    <span className="lang-code">{langCode.toUpperCase()}</span>
                    <span className="lang-rank">{rank}</span>
                  </div>
                </SimpleTooltip>
              ))}
          </div>
        )}

        {/* {isTrending ? <div className="trending-cont">Trending</div> : null} */}
        {isBirthdayPerson ? (
          <span
            className="birthday-cake-badge"
            role="img"
            aria-label="Birthday"
          >
            🎂
          </span>
        ) : null}
        <h2 className="profile-type">
          {person.occupation ? person.occupation.occupation : ""}
        </h2>
        <h1 className="profile-name">{person.name}</h1>
        {currentLang === "en" && person.description ? (
          <p className="profile-description">
            {person.description
              .replace(
                /\s*\([\d\s–—\-/,;.bcadBCAD]*\d{3,4}[\d\s–—\-/,;.bcadBCAD]*\)\s*/g,
                " ",
              )
              .trim()}
          </p>
        ) : null}
        {person.birthyear ? (
          <p className="date-subtitle">
            {FORMATTERS.year(person.birthyear)} -{" "}
            {person.deathyear
              ? `${FORMATTERS.year(person.deathyear)}`
              : t.stillAlive}
          </p>
        ) : null}
        <PageViewsChart pageviewsData={pageViews} lang={currentLang} />
      </div>
    </header>
  );
}
