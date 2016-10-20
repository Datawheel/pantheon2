import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import Navigation from 'containers/Navigation';
import Search from 'components/Search';
import styles from 'css/main';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, searchActive, location } = this.props;
    return (
      <div className={ location.pathname === '/' ? 'app home' : 'app'}>
        { searchActive ? <Search /> : null }
        <Navigation />
        {children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  searchActive: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    searchActive: state.search.searchActive
  };
}

export default connect(mapStateToProps)(App);
