import React, { PropTypes } from 'react';
import {connect} from "react-redux";
import Navigation from 'containers/Navigation';
import Search from 'components/Search';
import styles from 'css/main';

/*
 * React-router's <Router> component renders <Route>'s
 * and replaces `this.props.children` with the proper React Component.
 *
 * Please refer to `routes.jsx` for the route config.
 *
 * A better explanation of react-router is available here:
 * https://github.com/rackt/react-router/blob/latest/docs/Introduction.md
 */
const App = ({children, searchActive}) => {
  console.log("searchActive---",searchActive)
  return (
    <div className='app'>
      { searchActive ? <Search /> : null }
      <Navigation />
      {children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object,
  searchActive: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  // console.log("state---",state)
  return {
    searchActive: state.search.searchActive
  };
}

export default connect(mapStateToProps)(App);
