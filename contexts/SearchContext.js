import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {flushSync} from "react-dom";

const SearchVisibilityContext = createContext();

export const useSearchVisibility = () => useContext(SearchVisibilityContext);

export const SearchProvider = ({children}) => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef(null);

  const focusSearchInput = useCallback(() => {
    const input = searchInputRef.current;
    if (!input) return;

    try {
      input.focus({preventScroll: true});
    } catch {
      input.focus();
    }
  }, []);

  const openSearch = useCallback(() => {
    flushSync(() => {
      setSearchVisible(true);
    });

    focusSearchInput();

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(focusSearchInput);
    }
  }, [focusSearchInput]);

  const closeSearch = useCallback(() => {
    setSearchVisible(false);
  }, []);

  // Function to toggle the search based on key presses
  const toggleSearchVisibility = useCallback(event => {
    const tag = event.target.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target.isContentEditable;
    const isSearchShortcut = event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey && !event.altKey;
    if (isSearchShortcut && !isSearchVisible && !isTyping) {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape" && isSearchVisible) {
      closeSearch();
    }
  }, [isSearchVisible, openSearch, closeSearch]);

  useEffect(() => {
    window.addEventListener("keydown", toggleSearchVisibility);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", toggleSearchVisibility);
    };
  }, [toggleSearchVisibility]);

  return (
    <SearchVisibilityContext.Provider
      value={{
        isSearchVisible,
        setSearchVisible,
        openSearch,
        closeSearch,
        focusSearchInput,
        searchInputRef,
      }}
    >
      {children}
    </SearchVisibilityContext.Provider>
  );
};
