"use client";

import Image from "next/image";
import {useSearchVisibility} from "@/contexts/SearchContext";
import {getTranslations} from "@/app/translations";

export default function HomeSearch({lang = "en"}) {
  const {openSearch} = useSearchVisibility();
  const t = getTranslations(lang);

  return (
    <div className="home-search">
      <a onClick={openSearch}>
        <Image
          src="/images/icons/icon-search.svg"
          alt="search icon"
          width={16}
          height={16}
        />
        {t.home.searchPlaceholder}
      </a>
    </div>
  );
}
