"use client";

import {useRef, useState} from "react";
import Grid from "@/components/home/Grid";
import GridCta from "@/components/home/GridCta";
import Spinner from "@/components/Spinner";
import Select from "@/components/common/Select";
import {
  SUPPORTED_LOCALES,
  LOCALE_NATIVE_NAMES,
  getLocalizedLanguageName,
  DEFAULT_LOCALE,
} from "@/app/locales";
import {getTranslations} from "@/app/translations";

const LangSelector = ({handleLanguageChange, trendingLangEdition, currentLang}) => (
  <Select
    label=""
    className="home-select"
    fontSize="sm"
    onChange={handleLanguageChange}
    value={trendingLangEdition}
  >
    {SUPPORTED_LOCALES.map(locale => (
      <option key={locale} value={locale}>
        {getLocalizedLanguageName(locale, currentLang)}
      </option>
    ))}
  </Select>
);

// Same cookie the navigation language switcher writes, so the canonical
// unprefixed English homepage isn't resolved from a stale saved locale.
function persistLocaleCookie(locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

async function fetchJson(url) {
  const res = await fetch(url, {cache: "force-cache"}); // Use browser cache if available
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (text.startsWith("<")) throw new Error("Got HTML instead of JSON");
  return JSON.parse(text);
}

export default function TrendingGrid({
  title,
  allowLangChange,
  initialTrendingAll,
  defaultLang,
  occupation,
  showTrendIndicator = true,
  showDates = false,
  showTrendingExcerpt = false,
  trendingWithReasons = [],
  ctaHref,
  ctaLabel,
}) {
  // defaultLang is the site locale; the Wikipedia edition can differ from it
  // without navigating, so the rest of the page keeps the reader's language.
  const siteLang = defaultLang;
  const [trendingAll, setTrendingAll] = useState(initialTrendingAll);
  const [reasons, setReasons] = useState(trendingWithReasons);
  const [trendingLangEdition, setTrendingLangEdition] = useState(defaultLang);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const fetchEdition = async edition => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const trendingUrl = occupation
        ? `/api/wikiTrends?lang=${edition}&occupation=${occupation}&limit=16`
        : `/api/wikiTrends?lang=${edition}&limit=16`;
      const people = (await fetchJson(trendingUrl))
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 16);

      // Edition titles are in the edition's language; swap in names and trend
      // reasons in the reader's language.
      const extras = await fetchJson(
        `/api/trendReasons?lang=${siteLang}&slugs=${encodeURIComponent(people.map(p => p.slug).join(","))}&ids=${people.map(p => p.pid).filter(Boolean).join(",")}`,
      ).catch(error => {
        console.error("Error fetching trending reasons:", error);
        return {reasons: [], names: {}};
      });
      if (id !== requestId.current) return;
      const reasonNames = new Map(
        extras.reasons.map(r => [r.slug, r.localized_name]),
      );
      setTrendingAll(
        people.map(p => ({
          ...p,
          title: reasonNames.get(p.slug) || extras.names[p.pid] || p.name || p.title,
        })),
      );
      setReasons(extras.reasons);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
    if (id === requestId.current) setLoading(false);
  };

  const handleLanguageChange = e => {
    const edition = e.target.value;
    setTrendingLangEdition(edition);
    if (edition === siteLang && initialTrendingAll.length) {
      // Back to the server-rendered data for the reader's own edition
      requestId.current++;
      setTrendingAll(initialTrendingAll);
      setReasons(trendingWithReasons);
      setLoading(false);
      return;
    }
    fetchEdition(edition);
  };

  const t = getTranslations(siteLang);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const localePrefix = siteLang === DEFAULT_LOCALE ? "" : `/${siteLang}`;
  const showSiteLangNote = allowLangChange && trendingLangEdition !== siteLang;
  const switchPrompt = t.home.switchSiteLangPrompt || tEn.home.switchSiteLangPrompt;
  const switchCta = t.home.switchSiteLangCta || tEn.home.switchSiteLangCta;

  return (
    <div className="profile-grid">
      <div className="grid-title-container">
        <h3 className="grid-title">{title}</h3>
        {allowLangChange ? (
          <p className="grid-subtitle">
            <span className="grid-select-label">
              {t.home.topProfilesBy}{" "}
            </span>
            <LangSelector
              handleLanguageChange={handleLanguageChange}
              trendingLangEdition={trendingLangEdition}
              currentLang={siteLang}
            />
            <span className="grid-select-label"> {t.home.wikipediaEdition}</span>
          </p>
        ) : null}
      </div>
      {showSiteLangNote ? (
        <p className="grid-lang-note" role="status">
          {switchPrompt({
            language: getLocalizedLanguageName(trendingLangEdition, siteLang),
          })}{" "}
          {/* Plain anchor: a next/link prefetch of /xx would set the locale cookie */}
          <a
            href={`/${trendingLangEdition}`}
            hrefLang={trendingLangEdition}
            onClick={() => persistLocaleCookie(trendingLangEdition)}
          >
            {`${switchCta({language: LOCALE_NATIVE_NAMES[trendingLangEdition]})} →`}
          </a>
        </p>
      ) : null}
      {!loading ? (
        <Grid
          bios={
            allowLangChange
              ? [...trendingAll].sort((a, b) => a.rank - b.rank).slice(0, 16)
              : trendingAll.slice(0, 16)
          }
          showTrendIndicator={showTrendIndicator}
          showDates={showDates}
          localePrefix={localePrefix}
          trendingExcerpt={
            reasons.length > 0 && showTrendingExcerpt
              ? {
                  trendingPeople: reasons,
                  currentLang: siteLang,
                }
              : null
          }
        />
      ) : (
        <div className="loading-trends">
          <Spinner />
        </div>
      )}
      <GridCta href={ctaHref} label={ctaLabel} />
    </div>
  );
}
