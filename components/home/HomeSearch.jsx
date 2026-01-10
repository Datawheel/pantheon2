"use client";

import Image from "next/image";
import {useSearchVisibility} from "/contexts/SearchContext";
import {getTranslations} from "/app/translations";

export default function HomeSearch({lang = "en"}) {
  const {setSearchVisible} = useSearchVisibility();
  const t = getTranslations(lang);

  return (
    <div className="home-search">
      <Image
        src="/images/icons/icon-search.svg"
        alt="search icon"
        width={22}
        height={22}
      />
      <a onClick={() => setSearchVisible(true)}>
        {t.home.searchPlaceholder}
      </a>
    </div>
  );
}
