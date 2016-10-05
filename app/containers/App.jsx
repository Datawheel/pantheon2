import React, { PropTypes } from 'react';
import {connect} from "react-redux";
import Navigation from 'containers/Navigation';
import Message from 'containers/Message';
import Search from 'components/Search';
import classNames from 'classnames/bind';
import styles from 'css/main';

const cx = classNames.bind(styles);


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
    <div className={cx('app')}>
      { searchActive.visible ? <Search /> : null }
      <Navigation />
      <Message />
        {children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object,
  searchActive: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  console.log("state---",state)
  return {
    searchActive: state.searchActive
  };
}

export default connect(mapStateToProps)(App);
