import React from 'react';
import styles from 'css/components/home';
import { logOut, activateSearch } from 'actions/users';
import searchSvg from 'images/icon-search.svg';

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <div onClick={ activateSearch }>
        <img src={searchSvg} alt={`Search`} />
      </div>
    </div>
  );
};

export default Home;
