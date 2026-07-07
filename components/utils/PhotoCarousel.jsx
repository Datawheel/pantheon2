"use client";
import axios from "axios";
import {useRef, useEffect, useState} from "react";
import {PUBLIC_API} from "@/app/constants";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import Link from "next/link";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import PersonImage from "./PersonImage";
import Image from "next/image";
import {min as D3Min, max as D3Max} from "d3-array";
import {getTranslations} from "@/app/translations";

const PHOTO_WIDTH = 150;
const PHOTO_PADDING = 36;
const ITEMS_TO_LOAD = 12;

export default function PhotoCarousel({
  me,
  people,
  rankAccessor,
  showOccupation,
  peopleAll,
  localePrefix = "",
  lang = "en",
}) {
  const t = getTranslations(lang);
  const [lowerBound, setLowerBound] = useState(null);
  const [upperBound, setUpperBound] = useState(null);
  const [replacementPeople, setReplacementPeople] = useState([]);

  const scroll = async leftOrRight => {
    if (rankList.current) {
      const rankListContainer = rankList.current;
      const left = leftOrRight === "left";
      const direction = left ? -1 : 1;
      // console.log("scrolled direction?", direction);

      // store old offset for comparison with new
      const oldOffset = rankListContainer.scrollLeft;

      // modify horizontal scroll position of container
      rankListContainer.scrollLeft += PHOTO_WIDTH * direction;
      const newOffset = rankListContainer.scrollLeft;

      // load more items if user has reached end (either furthest right or left)
      if (oldOffset === newOffset) {
        // console.log("load more!");
        const peopleShown = replacementPeople.length
          ? replacementPeople
          : people;

        // IF user wants to load more items to the left, decrease lower bound limit
        const newLowerBound = left
          ? Math.max(
              1,
              D3Min(peopleShown, person => person[rankAccessor]) - ITEMS_TO_LOAD
            )
          : D3Min(peopleShown, person => person[rankAccessor]);
        if (left && lowerBound === newLowerBound) {
          return;
        }

        // IF user wants to load more items to the right, increase upper bound limit
        const newUpperBound = left
          ? D3Max(peopleShown, person => person[rankAccessor])
          : D3Max(peopleShown, person => person[rankAccessor]) + ITEMS_TO_LOAD;
        if (!left && upperBound === newUpperBound) {
          return;
        }

        // console.log(
        //   "newLowerBound|newUpperBound",
        //   newLowerBound,
        //   newUpperBound
        // );
        // console.log("rankAccessor", rankAccessor);

        // determine filter key
        const filterKey = rankAccessor.replace("_rank_unique", "");

        // determine whether to fetch more people from server or not
        if (peopleAll) {
          console.log("No API");
        } else {
          let datasetFilter = "";
          if (rankAccessor === "bplace_country_occupation_rank_unique") {
            datasetFilter = me
              ? `bplace_country=eq.${me.bplace_country.id}&occupation=eq.${encodePostgrestValue(me.occupation.id)}&`
              : "";
          } else {
            datasetFilter = me
              ? `${filterKey}=eq.${me[filterKey].id || me[filterKey]}&`
              : "";
          }
          const morePeopleUrl = `/person_ranks?${datasetFilter}${rankAccessor}=gte.${newLowerBound}&${rankAccessor}=lte.${newUpperBound}&select=occupation,bplace_country,hpi,${rankAccessor.replace(
            "_unique",
            ""
          )},${rankAccessor},slug,gender,name,id,birthyear,deathyear`;
          // console.log("morePeopleUrl", morePeopleUrl);
          const newPeopleResults = await axios.get(
            `${PUBLIC_API}${morePeopleUrl}`
          );
          const replacementPeople = newPeopleResults.data.sort(
            (personA, personB) => personA[rankAccessor] - personB[rankAccessor]
          );
          // lastly set the offset to the former last item is still in view
          const diffx = lowerBound - newLowerBound;
          setReplacementPeople(replacementPeople);
          setLowerBound(newLowerBound);
          setUpperBound(newUpperBound);
          if (direction > 0) {
            rankListContainer.scrollLeft +=
              (PHOTO_WIDTH + PHOTO_PADDING) * 5 - PHOTO_WIDTH / 2;
          } else {
            rankListContainer.scrollLeft +=
              (PHOTO_WIDTH + PHOTO_PADDING) * Math.min(7, diffx);
          }
        }
      }
    }
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

  const peopleToRender = replacementPeople.length ? replacementPeople : people;

  return (
    <div className="rank-carousel">
      <a
        className="arrow back"
        href="#"
        onClick={e => (e.preventDefault(), scroll("left"))}
      >
        <Image
          width={8}
          height={12}
          className="back"
          src="/images/ui/tri-left-b.svg"
          alt="Load previous"
        />
      </a>
      <>
        <ul className="rank-list" ref={rankList}>
          {peopleToRender.map(person => (
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
                <Link href={`${localePrefix}/profile/person/${person.slug}/`}>
                  <PersonImage
                    person={person}
                    src={`/profile/people/${person.id}.jpg`}
                    alt={`Photo of ${person.name}`}
                    fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                  />
                </Link>
              </div>
              <h2>
                <Link href={`${localePrefix}/profile/person/${person.slug}/`}>
                  {person.name}
                </Link>
              </h2>
              {showOccupation ? (
                <p>
                  {person.occupation
                    ? typeof person.occupation === "string"
                      ? person.occupation
                      : person.occupation.occupation
                    : ""}
                </p>
              ) : null}
              {person.birthyear ? (
                <p className="rank-year">
                  {FORMATTERS.year(person.birthyear)} -{" "}
                  {person.deathyear
                    ? `${FORMATTERS.year(person.deathyear)}`
                    : t.person.carousel.present}
                </p>
              ) : null}
              <p className="rank-year">
                <strong>{t.person.carousel.hpiLabel}</strong>{" "}
                {FORMATTERS.decimal(person.hpi)}
              </p>
              {rankAccessor && person[rankAccessor] ? (
                <p className="rank-year">
                  <strong>{t.person.carousel.rankLabel}</strong>{" "}
                  {FORMATTERS.commas(person[rankAccessor])}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </>
      <a
        className="arrow forward"
        href="#"
        onClick={e => (e.preventDefault(), scroll("right"))}
      >
        <Image
          width={8}
          height={12}
          className="forward"
          src="/images/ui/tri-right-b.svg"
          alt="Load previous"
        />
      </a>
    </div>
  );
}
