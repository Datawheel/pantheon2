import {createContext, useContext, useEffect, useState} from "react";

const SearchVisibilityContext = createContext();

export const useSearchVisibility = () => useContext(SearchVisibilityContext);

export const SearchProvider = ({children}) => {
  const [isSearchVisible, setSearchVisible] = useState(false);

  // Function to toggle the search based on key presses
  const toggleSearchVisibility = event => {
    const tag = event.target.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target.isContentEditable;
    if (event.key === "s" && !isSearchVisible && !isTyping) {
      setSearchVisible(true);
    } else if (event.key === "Escape" && isSearchVisible) {
      setSearchVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", toggleSearchVisibility);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", toggleSearchVisibility);
    };
  }, [isSearchVisible]);

  return (
    <SearchVisibilityContext.Provider
      value={{isSearchVisible, setSearchVisible}}
    >
      {children}
    </SearchVisibilityContext.Provider>
  );
};
