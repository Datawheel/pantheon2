import React, {useState, useEffect, useRef} from "react";
import {strip, trim} from "d3plus-text";
import axios from "axios";
import {Icon, NonIdealState} from "@blueprintjs/core";
import {useSearchVisibility} from "/contexts/SearchContext";
import "/components/Search.css";

const SearchComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [showTrending, setShowTrending] = useState(true);
  const [debouncedValue, setDebouncedValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const {isSearchVisible, setSearchVisible} = useSearchVisibility();
  const inputRef = useRef(null);

  useEffect(() => {
    fetchLatestTrendData();
  }, []);

  useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus(); // Focus after a delay
      }, 100);
      return () => clearTimeout(timer); // Clear the timeout if the component unmounts or isVisible changes again
    }
  }, [isSearchVisible]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
      fetchData(inputValue);
    }, 800);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    if (!isSearchVisible || !results || !results.length) return;
    const handleKeyDown = event => {
      if (event.key === "ArrowUp") {
        setActiveIndex(
          prevIndex => (prevIndex - 1 + results.length) % results.length
        );
      } else if (event.key === "ArrowDown") {
        setActiveIndex(prevIndex => (prevIndex + 1) % results.length);
      } else if (event.key === "Enter" && activeIndex !== -1) {
        // Follow the link for the active item
        const activeItem = results[activeIndex];
        window.location.href = `/profile/${activeItem.profile_type}/${activeItem.slug}`;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [results, activeIndex, isSearchVisible]);

  const handleChange = e => {
    setInputValue(e.target.value);
  };

  // Function to fetch data from API
  const fetchData = async query => {
    if (!query || query.length < 3) {
      fetchLatestTrendData();
      return;
    }
    try {
      setShowTrending(false);
      let userQueryCleaned = trim(query).split(" ");
      userQueryCleaned = userQueryCleaned.map(strip);
      const lastItem = userQueryCleaned[userQueryCleaned.length - 1];
      userQueryCleaned[userQueryCleaned.length - 1] = `${lastItem}:*`;
      userQueryCleaned = userQueryCleaned.join("%26");

      const response = await axios.get(
        `https://api.pantheon.world/search?document=fts.${userQueryCleaned}&order=weight.desc.nullslast&limit=100`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  // Function to fetch latest trend data from API
  const fetchLatestTrendData = async query => {
    try {
      const response = await axios.get(`/api/wikiTrends?lang=en&limit=12`);
      const results = response.data.map(d => ({
        name: d.name,
        profile_type: "person",
        primary_meta: d.occupation,
        slug: d.slug,
      }));
      setShowTrending(true);
      setResults(results);
    } catch (error) {
      console.error("Error fetching latest trend data:", error);
      setResults([]);
    }
  };

  if (!isSearchVisible) return null;

  return (
    <div className="search">
      <button className="search-close" onClick={() => setSearchVisible(false)}>
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
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
            />
          </>
        </label>
        {showTrending ? (
          <div className="trending-text">
            <Icon icon="trending-up" size={20} /> Trending Searches...
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
                  <a href={`/profile/${result.profile_type}/${result.slug}`}>
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
            <NonIdealState
              icon="search"
              title="No results found"
              description={
                <div>
                  Unable to find results for &ldquo;
                  <code>{debouncedValue}</code>
                  &rdquo;.
                </div>
              }
              action={undefined}
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchComponent;
