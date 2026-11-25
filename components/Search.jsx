import {useEffect, useId, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import {TrendingUp, X} from "lucide-react";
import {useParams} from "next/navigation";
import {useSearchVisibility} from "@/contexts/SearchContext";
import {PUBLIC_API} from "@/app/constants";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import "./Search.css";

async function getSuggestions(query, locale, signal) {
  if (query === null) {
    const {data} = await axios.get("/api/wikiTrends", {params: {lang: locale, limit: 12}, signal});
    return data.map(row => ({
      "entity_id": row.pid,
      "profile_type": "person",
      name: row.name,
      "primary_meta": row.occupation,
      slug: row.slug,
    }));
  }
  // search_v3 (etl/search in pantheon-etl): people, entities and the compound pages
  // (occupation x country, country vs country, occupation x country vs country).
  const {data} = await axios.get(`${PUBLIC_API}/rpc/search_v3`, {params: {q: query, lim: 30, lang: locale}, signal});
  return data;
}

// Wait for a pause in typing, but not long enough to feel broken.
const SEARCH_DEBOUNCE_MS = 200;

const iconNames = {
  person: "person", occupation: "prof", country: "country", place: "place", era: "era",
  "occupation_country": "prof", "country_vs": "country", "occupation_country_vs": "prof",
};

// Every result carries `path` (e.g. /profile/country/france/vs/japan); the fallback keeps an
// older API response working.
function resultHref(result, locale) {
  const path = result.path || `/profile/${result.profile_type}/${result.slug}`;
  return `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${path}`;
}

function suggestionQuery(value) {
  const trimmed = value.trim();
  // "li" is a real prefix now that the backend completes words; one CJK character is a real name
  return trimmed.length >= 2 || /[^\u0000-\u007f]/.test(trimmed) ? trimmed : null;
}

// Compound pages say what they are ("Country comparison"); everything else shows the
// API's own meta (occupation · birthplace for a person, industry for an occupation ...).
function searchMeta(result, t) {
  return t.searchSuggestions.types?.[result.profile_type]
    || [result.primary_meta, result.secondary_meta].filter(Boolean).join(" · ");
}

function SearchPanel({value, setValue, locale}) {
  const {searchInputRef, closeSearch} = useSearchVisibility();
  const t = getTranslations(locale);
  const list = useRef(null);
  const listId = useId();
  const [expanded, setExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [retry, setRetry] = useState(0);
  const [response, setResponse] = useState(null);
  const query = suggestionQuery(value);
  const current = response?.query === query && response.retry === retry ? response : null;
  const results = current?.results ?? [];
  const active = expanded && results[activeIndex];

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await getSuggestions(query, locale, controller.signal);
        if (!controller.signal.aborted) setResponse({query, retry, results});
      } catch {
        if (!controller.signal.aborted) setResponse({query, retry, error: true});
      }
    }, query === null ? 0 : SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale, retry]);

  useEffect(() => {
    if (active) list.current.children[activeIndex].scrollIntoView({block: "nearest"});
  }, [active, activeIndex]);

  function collapse() {
    setExpanded(false);
    setActiveIndex(-1);
  }

  function onKeyDown(event) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Tab") {
      collapse();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        setExpanded(true);
        if (results.length) {
          const last = results.length - 1;
          if (event.key === "ArrowDown") {
            setActiveIndex(index => Math.min(index + 1, last));
          } else {
            setActiveIndex(index => index === -1 ? last : Math.max(0, index - 1));
          }
        }
        break;
      case "Enter":
        if (active) {
          event.preventDefault();
          list.current.children[activeIndex].click();
        }
        break;
      case "Escape":
        if (expanded) {
          event.preventDefault();
          event.stopPropagation();
          collapse();
        }
        break;
      case "Home":
      case "End":
      case "ArrowLeft":
      case "ArrowRight":
        setActiveIndex(-1);
        break;
    }
  }

  let status = t.searchSuggestions.count(results.length);
  if (!current) status = t.person.loading;
  else if (current.error) status = t.searchSuggestions.error;
  else if (!results.length) status = t.searchSuggestions.empty;

  return (
    <section className="search" aria-label={t.nav.search}
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeSearch();
      }}>
      <div className="search-controls">
        <button type="button" aria-label={t.searchSuggestions.close} onClick={() => closeSearch(true)}>
          <X aria-hidden="true" size={18}/>
        </button>
        <input ref={searchInputRef} name="q" type="text" autoComplete="off"
          role="combobox" aria-label={t.home.searchPlaceholder} placeholder={t.home.searchPlaceholder}
          aria-expanded={expanded} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={active ? `${listId}-${activeIndex}` : undefined}
          value={value} onKeyDown={onKeyDown} onBlur={event => {
            if (!list.current?.contains(event.relatedTarget)) collapse();
          }}
          onClick={() => setExpanded(true)}
          onChange={event => {
            if (suggestionQuery(event.target.value) !== query) setResponse(null);
            setValue(event.target.value);
            setActiveIndex(-1);
            setExpanded(true);
            if (list.current) list.current.scrollTop = 0;
          }}/>
        {current?.error && (
          <button type="button" onClick={() => {
            searchInputRef.current.focus();
            setExpanded(true);
            setRetry(count => count + 1);
          }}>{t.searchSuggestions.retry}</button>
        )}
      </div>
      <div className="search-popup" hidden={!expanded}>
        {query === null && results.length > 0 && (
          <div className="search-trending"><TrendingUp size={16} aria-hidden="true"/>{t.person.sections.trending}</div>
        )}
        <div role="listbox" id={listId} ref={list} className="results-list" aria-label={t.nav.search}>
          {results.map((result, index) => (
            <a role="option" tabIndex={-1} aria-selected={index === activeIndex}
              key={`${result.profile_type}_${result.entity_id ?? result.pid ?? `${result.slug}_${index}`}`}
              id={`${listId}-${index}`}
              href={resultHref(result, locale)}
              onMouseDown={event => event.preventDefault()}>
              <span aria-hidden="true" className="search-icon">
                {iconNames[result.profile_type] && <Image alt="" width="18" height="18" src={`/images/icons/icon-${iconNames[result.profile_type]}.svg`}/>}
              </span>
              <span className="search-name">{result.name}</span>
              {searchMeta(result, t) && <span className="search-meta">{searchMeta(result, t)}</span>}
            </a>
          ))}
        </div>
      </div>
      <div role="status" aria-atomic="true" className={expanded && !results.length ? "search-message" : "search-announcement"}>
        {expanded ? status : ""}
      </div>
    </section>
  );
}

export default function SearchComponent() {
  const {locale} = useParams();
  const {isSearchVisible, closeSearch} = useSearchVisibility();
  const [value, setValue] = useState("");
  return isSearchVisible && (
    <div className="search-overlay" onClick={event => {
      if (event.target === event.currentTarget) closeSearch(true);
    }}>
      <SearchPanel key={locale} locale={SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE}
        value={value} setValue={setValue}/>
    </div>
  );
}
