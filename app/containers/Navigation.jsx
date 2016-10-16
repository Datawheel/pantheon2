import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut, activateSearch } from 'actions/users';
import classNames from 'classnames/bind';
import styles from 'css/components/navigation';
import pantheonLogoSvg from 'images/logo.svg';
import searchSvg from 'images/icon-search.svg';

const Navigation = ({ user, logOut, activateSearch }) => {
    return (
      <nav className='navigation' role="navigation">
        <ul>
          <li className='item'>
            <Link to="/explore" className='item-link explore' activeClassName='active'>Explore</Link>
          </li>
          <li className='item'>
            <Link to="/profile" className='item-link profiles' activeClassName='active'>Profiles</Link>
          </li>
          <li className='item'>
            <Link to="/" className='home' activeClassName='active'>
              <img className='logo' src={pantheonLogoSvg} alt={`Pantheon`} />
            </Link>
          </li>
          <li className='item'>
            <Link to="/about" className='item-link about' activeClassName='active'>About</Link>
          </li>
          <li className='item'>
            <Link to="/data" className='item-link data' activeClassName='active'>Data</Link>
          </li>
          <li className='item search-btn'>
            <span onClick={ activateSearch }>
              <img src={searchSvg} alt={`Search`} />
            </span>
          </li>
        </ul>
      </nav>
    );
};

Navigation.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired,
  activateSearch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { logOut, activateSearch })(Navigation);
