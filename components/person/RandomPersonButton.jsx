"use client";

import {useRouter} from "next/navigation";

const PUBLIC_API = process.env.NEXT_PUBLIC_BASE_API || "https://api.pantheon.world";

export default function RandomPersonButton({label, locale, totalCount}) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const offset = Math.floor(Math.random() * (totalCount || 85000));
      const res = await fetch(
        `${PUBLIC_API}/person?select=slug&limit=1&offset=${offset}`,
      );
      const [person] = await res.json();
      if (person?.slug) {
        router.push(`/${locale}/profile/person/${person.slug}`);
      }
    } catch {
      router.push(`/${locale}/profile/person/Jesus`);
    }
  };

  return (
    <button className="sp-random-btn" onClick={handleClick}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
      </svg>
      {label}
    </button>
  );
}
