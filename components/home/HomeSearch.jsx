"use client";

import Image from "next/image";
import {useSearchVisibility} from "/contexts/SearchContext";

export default function HomeSearch() {
  const {setSearchVisible} = useSearchVisibility();

  return (
    <div className="home-search">
      <Image
        src="/images/icons/icon-search.svg"
        alt="search icon"
        width={22}
        height={22}
      />
      <a onClick={() => setSearchVisible(true)}>
        Search people, places, &amp; occupations
      </a>
    </div>
  );
}
