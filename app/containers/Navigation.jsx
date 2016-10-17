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
              <li><Link to="/explore" className='item-link' activeClassName='active'>Data Explorer</Link></li>
              <li><Link to="/explore" className='item-link' activeClassName='active'>Rankings</Link></li>
            </ul>
          </li>
          <li className='item'>
            <Link to="/profile" className='item-link profiles' activeClassName='active'>Profiles</Link>
            <ul className={'sub-items'}>
              <li><Link to="/profile/person" className='item-link' activeClassName='active'>People</Link></li>
              <li><Link to="/profile/place" className='item-link' activeClassName='active'>Places</Link></li>
              <li><Link to="/profile/profession" className='item-link' activeClassName='active'>Professions</Link></li>
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
              <li><Link to="/about/team" className='item-link' activeClassName='active'>Team</Link></li>
              <li><Link to="/about/vision" className='item-link' activeClassName='active'>Vision</Link></li>
              <li><Link to="/about/publications" className='item-link' activeClassName='active'>Publications</Link></li>
              <li><Link to="/about/methods" className='item-link' activeClassName='active'>Methods</Link></li>
              <li><Link to="/about/data_sources" className='item-link' activeClassName='active'>Data Sources</Link></li>
              <li><Link to="/about/resources" className='item-link' activeClassName='active'>Resources</Link></li>
              <li><Link to="/about/references" className='item-link' activeClassName='active'>References</Link></li>
              <li><Link to="/about/contact" className='item-link' activeClassName='active'>Contact</Link></li>
            </ul>
          </li>
          <li className='item'>
            <Link to="/data" className='item-link data' activeClassName='active'>Data</Link>
            <ul className={'sub-items'}>
              <li><Link to="/data/data" className='item-link' activeClassName='active'>Data</Link></li>
              <li><Link to="/about/api" className='item-link' activeClassName='active'>API</Link></li>
              <li><Link to="/about/permissions" className='item-link' activeClassName='active'>Permissions</Link></li>
              <li><Link to="/about/faq" className='item-link' activeClassName='active'>FAQ</Link></li>
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
