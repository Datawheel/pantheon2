import {createContext, useContext, useState} from "react";

const SearchVisibilityContext = createContext();

export const useSearchVisibility = () => useContext(SearchVisibilityContext);

export const SearchProvider = ({children}) => {
  const [isSearchVisible, setSearchVisible] = useState(false);

  return (
    <SearchVisibilityContext.Provider
      value={{isSearchVisible, setSearchVisible}}
    >
      {children}
    </SearchVisibilityContext.Provider>
  );
};
