import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut, activateSearch } from 'actions/users';
import classNames from 'classnames/bind';
import styles from 'css/components/navigation';
import pantheonLogoSvg from 'images/logo.svg';
import searchSvg from 'images/icon-search.svg';

const toggleSubNav = (e) => {
  const itemChildren = e.target.childNodes;
  itemChildren.forEach((child)=>{
    if(child.nodeType === 1 && child.tagName === "UL") {
      child.style.display = "block";
    }
  })
}

const Navigation = ({ user, logOut, activateSearch }) => {
    return (
      <nav className='navigation' role="navigation">
        <ul className='items'>
          <li className='item'>
            <Link to="/explore" className='item-link explore' activeClassName='active'>Explore</Link>
            <ul className={'sub-items'}>
              <li><a href="/explore" className='item-link'>Data Explorer</a></li>
              <li><a href="/explore" className='item-link'>Rankings</a></li>
            </ul>
          </li>
          <li className='item'>
            <Link to="/profile" className='item-link profiles' activeClassName='active'>Profiles</Link>
            <ul className={'sub-items'}>
              <li><a href="/profile/person" className='item-link'>People</a></li>
              <li><a href="/profile/place" className='item-link'>Places</a></li>
              <li><a href="/profile/profession" className='item-link'>Professions</a></li>
            </ul>
          </li>
          <li className='item'>
            <Link to="/" className='home' activeClassName='active'>
              <img className='logo' src={pantheonLogoSvg} alt={`Pantheon`} />
            </Link>
          </li>
          <li className='item'>
            <Link to="/about" className='item-link about' activeClassName='active'>About</Link>
            <ul className={'sub-items'}>
              <li><a href="/about/team" className='item-link'>Team</a></li>
              <li><a href="/about/vision" className='item-link'>Vision</a></li>
              <li><a href="/about/publications" className='item-link'>Publications</a></li>
              <li><a href="/about/methods" className='item-link'>Methods</a></li>
              <li><a href="/about/data_sources" className='item-link'>Data Sources</a></li>
              <li><a href="/about/resources" className='item-link'>Resources</a></li>
              <li><a href="/about/references" className='item-link'>References</a></li>
              <li><a href="/about/contact" className='item-link'>Contact</a></li>
            </ul>
          </li>
          <li className='item'>
            <Link to="/data" className='item-link data' activeClassName='active'>Data</Link>
            <ul className={'sub-items'}>
              <li><a href="/data/data" className='item-link'>Data</a></li>
              <li><a href="/about/api" className='item-link'>API</a></li>
              <li><a href="/about/permissions" className='item-link'>Permissions</a></li>
              <li><a href="/about/faq" className='item-link'>FAQ</a></li>
            </ul>
          </li>
          <li className='search-btn'>
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
