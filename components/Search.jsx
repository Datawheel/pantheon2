import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {TrendingUp, Search as SearchIcon} from "lucide-react";
import {useParams, usePathname} from "next/navigation";
import {useSearchVisibility} from "@/contexts/SearchContext";
import {PUBLIC_API} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import "./Search.css";

async function getLatestTrendResults(locale) {
  const response = await axios.get(`/api/wikiTrends?lang=${locale}&limit=12`);
  return response.data.map(d => ({
    name: d.name,
    profile_type: "person",
    primary_meta: d.occupation,
    slug: d.slug,
  }));
}

const SearchComponent = () => {
  const params = useParams();
  const pathname = usePathname();

  // Determine locale from params or pathname
  const getLocale = () => {
    if (params?.locale && SUPPORTED_LOCALES.includes(params.locale)) {
      return params.locale;
    }
    // Check pathname for locale
    const pathMatch = pathname?.match(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(/|$)`));
    if (pathMatch) {
      return pathMatch[1];
    }
    return DEFAULT_LOCALE;
  };
  const locale = getLocale();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [showTrending, setShowTrending] = useState(true);
  const [debouncedValue, setDebouncedValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const {
    isSearchVisible,
    closeSearch,
    focusSearchInput,
    searchInputRef,
  } = useSearchVisibility();

  // Function to fetch latest trend data from API
  const fetchLatestTrendData = useCallback(async () => {
    try {
      const results = await getLatestTrendResults(locale);
      setShowTrending(true);
      setResults(results);
    } catch (error) {
      console.error("Error fetching latest trend data:", error);
      setResults([]);
    }
  }, [locale]);

  // Function to fetch data from API
  const fetchData = useCallback(async query => {
    if (!query || query.length < 3) {
      fetchLatestTrendData();
      return;
    }
    try {
      setShowTrending(false);
      const cleanedQuery = query.trim();
      const response = await axios.get(
        `${PUBLIC_API}/rpc/search_hybrid?q=${cleanedQuery}&lim=50`,
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  }, [fetchLatestTrendData]);

  useEffect(() => {
    let cancelled = false;
    getLatestTrendResults(locale)
      .then(results => {
        if (cancelled) return;
        setShowTrending(true);
        setResults(results);
      })
      .catch(error => {
        if (cancelled) return;
        console.error("Error fetching latest trend data:", error);
        setResults([]);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (!isSearchVisible) return;

    focusSearchInput();
    const frame = window.requestAnimationFrame(focusSearchInput);
    const timer = window.setTimeout(focusSearchInput, 100);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [isSearchVisible, focusSearchInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
      fetchData(inputValue);
    }, 800);

    return () => clearTimeout(timeout);
  }, [inputValue, fetchData]);

  useEffect(() => {
    if (!isSearchVisible || !results || !results.length) return;
    const handleKeyDown = event => {
      if (event.key === "ArrowUp") {
        setActiveIndex(
          prevIndex => (prevIndex - 1 + results.length) % results.length,
        );
      } else if (event.key === "ArrowDown") {
        setActiveIndex(prevIndex => (prevIndex + 1) % results.length);
      } else if (event.key === "Enter" && activeIndex !== -1) {
        // Follow the link for the active item
        const activeItem = results[activeIndex];
        const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
        window.location.href = `${localePrefix}/profile/${activeItem.profile_type}/${activeItem.slug}`;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [results, activeIndex, isSearchVisible, locale]);

  const handleChange = e => {
    setInputValue(e.target.value);
  };

  if (!isSearchVisible) return null;

  return (
    <div className="search">
      <button className="search-close" onClick={closeSearch}>
        <i>
          <span className="close-perimeter" />
          <span className="close-x close-back" />
          <span className="close-x close-for" />
        </i>
      </button>
      <div className="search-results">
        <label className="search-result-input">
          <div className="search-mg">
            <div className="search-mg-perimeter" />
            <div className="search-mg-handle" />
          </div>
          <>
            <input
              ref={searchInputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
            />
          </>
        </label>
        {showTrending ? (
          <div className="trending-text">
            <TrendingUp size={20} /> Trending Searches...
          </div>
        ) : null}
        {results ? (
          results.length ? (
            <ul className="results-list">
              {results.map((result, index) => (
                <li
                  key={`person_${result.slug}`}
                  className={`result-${result.profile_type}`}
                >
                  <a href={`${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/profile/${result.profile_type}/${result.slug}`}>
                    {index === activeIndex && "→ "}
                    {result.name}
                    <sub>
                      {result.primary_meta ? (
                        <span>{result.primary_meta}</span>
                      ) : null}
                      {result.secondary_meta ? (
                        <span>{result.secondary_meta}</span>
                      ) : null}
                    </sub>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-no-results">
              <SearchIcon size={48} strokeWidth={1} />
              <h3>No results found</h3>
              <p>
                Unable to find results for &ldquo;
                <code>{debouncedValue}</code>
                &rdquo;.
              </p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchComponent;
