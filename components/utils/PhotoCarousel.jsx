"use client";
import {useRef, useEffect} from "react";
import Link from "next/link";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import PersonImage from "./PersonImage";

export default function PhotoCarousel({me, people, rankAccessor}) {
  const scroll = () => {
    console.log("scrolled!");
  };
  const rankList = useRef(null);
  const myId = me ? me.id : null;

  useEffect(() => {
    if (rankList.current) {
      const rankListContainer = rankList.current;
      const rankTarget = rankListContainer.querySelector(".rank-me");

      if (rankTarget) {
        const targetPosition = rankTarget.offsetLeft;
        const centerScrollPosition =
          targetPosition -
          rankListContainer.clientWidth / 2 +
          rankTarget.clientWidth / 2;

        rankListContainer.scrollLeft = centerScrollPosition;
      }
    }
  }, []);

  return (
    <div className="rank-carousel">
      <a className="arrow back" href="#" onClick={scroll}>
        <img
          className="back"
          src="/images/ui/tri-left-b.svg"
          alt="Load previous"
        />
      </a>
      <>
        <ul className="rank-list" ref={rankList}>
          {people.map(person => (
            <li
              key={`${person.id}`}
              className={person.id === myId ? "rank-me" : null}
            >
              <div
                className="rank-photo"
                style={{
                  backgroundColor: person.occupation
                    ? COLORS_DOMAIN[person.occupation.domain_slug]
                    : "#efefef",
                }}
              >
                <Link href={`/profile/person/${person.slug}/`}>
                  <PersonImage
                    src={`/images/profile/people/${person.id}.jpg`}
                    alt={`Photo of ${person.name}`}
                    fallbackSrc="/images/icons/icon-person.svg"
                  />
                </Link>
              </div>
              <h2>
                <Link href={`/profile/person/${person.slug}/`}>
                  {person.name}
                </Link>
              </h2>
              {person.birthyear ? (
                <p className="rank-year">
                  {FORMATTERS.year(person.birthyear)} -{" "}
                  {person.deathyear
                    ? `${FORMATTERS.year(person.deathyear)}`
                    : "Present"}
                </p>
              ) : null}
              <p className="rank-year">
                <strong>HPI:</strong> {FORMATTERS.decimal(person.hpi)}
              </p>
              {rankAccessor && person[rankAccessor] ? (
                <p className="rank-year">
                  <strong>Rank:</strong>{" "}
                  {FORMATTERS.commas(person[rankAccessor])}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </>
      <a className="arrow forward" href="#" onClick={scroll}>
        <img
          className="forward"
          src="/images/ui/tri-right-b.svg"
          alt="Load previous"
        />
      </a>
    </div>
  );
}
