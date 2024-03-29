import {useSearchVisibility} from "/contexts/SearchContext";

const SearchComponent = () => {
  const {isSearchVisible} = useSearchVisibility();

  if (!isSearchVisible) return null;

  return (
    <div>
      <h1>MYsearch UI</h1>
    </div>
  );
};

export default SearchComponent;
