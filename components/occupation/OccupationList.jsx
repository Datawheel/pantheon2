"use client";

import {useState, useMemo} from "react";
import Link from "next/link";

const LOCAL_IMAGES = new Set([
  "actor",
  "politician",
  "religious-figure",
  "soccer-player",
  "writer",
  "athlete",
  "musician",
  "singer",
  "military-personnel",
  "film-director",
  "painter",
  "basketball-player",
  "tennis-player",
  "composer",
  "cyclist",
  "nobleman",
  "biologist",
  "racing-driver",
  "wrestler",
  "philosopher",
  "mathematician",
  "physicist",
  "social-activist",
  "businessperson",
  "skier",
  "swimmer",
  "physician",
  "companion",
  "hockey-player",
  "astronomer",
  "historian",
  "chemist",
  "boxer",
  "explorer",
  "astronaut",
  "architect",
  "chess-player",
  "inventor",
  "skater",
  "coach",
  "economist",
  "engineer",
  "handball-player",
  "gymnast",
  "fencer",
  "model",
  "extremist",
  "celebrity",
  "sculptor",
  "computer-scientist",
  "psychologist",
  "comic-artist",
  "pornographic-actor",
  "linguist",
  "volleyball-player",
  "journalist",
  "martial-arts",
  "archaeologist",
  "photographer",
  "referee",
  "presenter",
  "producer",
  "cricketer",
  "lawyer",
  "conductor",
  "artist",
  "badminton-player",
  "dancer",
  "table-tennis-player",
  "designer",
  "comedian",
  "anthropologist",
  "baseball-player",
  "diplomat",
  "geologist",
  "geographer",

  "sociologist",
  "game-designer",
  "golfer",
  "pilot",
  "mafioso",
  "snooker",
  "american-football-player",
  "youtuber",
  "mountaineer",
  "judge",
  "fashion-designer",
  "political-scientist",
  "occultist",
  "rugby-player",
  "pirate",
  "public-worker",
  "poker-player",
  "chef",
  "magician",
  "inspiration",
  "critic",
  "statistician",
  "gamer",
  "bullfighter",
  "go-player",
]);

function getOccupationImage(slug) {
  if (LOCAL_IMAGES.has(slug)) {
    return `/images/occupations/pantheon-${slug}.webp`;
  }
  return `https://static.pantheon.world/profile/occupation/${slug}.jpg`;
}

export default function OccupationList({
  occupations,
  localePrefix,
  locale,
  labels,
}) {
  const [sortBy, setSortBy] = useState("people");

  const sorted = useMemo(() => {
    if (sortBy === "alpha") {
      return [...occupations].sort((a, b) =>
        a.localName.localeCompare(b.localName, locale),
      );
    }
    return [...occupations].sort(
      (a, b) => (b.num_born || 0) - (a.num_born || 0),
    );
  }, [occupations, sortBy, locale]);

  return (
    <>
      <div className="so-list-header">
        <h2 className="so-section-title">{labels.occupationList}</h2>
        <div className="so-sort-controls">
          <button
            className={`so-sort-btn ${sortBy === "alpha" ? "so-sort-btn-active" : ""}`}
            onClick={() => setSortBy("alpha")}
          >
            {labels.sortAlpha}
          </button>
          <button
            className={`so-sort-btn ${sortBy === "people" ? "so-sort-btn-active" : ""}`}
            onClick={() => setSortBy("people")}
          >
            {labels.sortPeople}
          </button>
        </div>
      </div>
      <div className="so-grid">
        {sorted.map(occ => (
          <Link
            key={occ.occupation_slug}
            href={`${localePrefix}/profile/occupation/${occ.occupation_slug}`}
            className="so-card"
          >
            <div
              className="so-card-image"
              style={{
                backgroundImage: `url(${getOccupationImage(occ.occupation_slug)})`,
              }}
            />
            <div className="so-card-body">
              <span className="so-card-name">
                {occ.localName}
                <span className="so-card-count">
                  {(occ.num_born || 0).toLocaleString(locale)}
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
