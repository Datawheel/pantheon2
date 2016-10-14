import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut, activateSearch } from 'actions/users';
import { Icon } from 'react-fa'
import classNames from 'classnames/bind';
import styles from 'css/components/navigation';

const cx = classNames.bind(styles);

const Navigation = ({ user, logOut, activateSearch }) => {
    return (
      <nav className={cx('navigation')} role="navigation">
        <ul>
          <li className={cx('item')}>
            <Link to="/explore" className={cx('item-link', 'explore')} activeClassName={cx('active')}>Explore</Link>
          </li>
          <li className={cx('item')}>
            <Link to="/profile" className={cx('item-link', 'profiles')} activeClassName={cx('active')}>Profiles</Link>
          </li>
          <li className={cx('item')}>
            <Link to="/" className={cx('home')} activeClassName={cx('active')}>
              <img className={cx('logo')} src={`/logo.svg`} alt={`Pantheon`} />
            </Link>
          </li>
          <li className={cx('item')}>
            <Link to="/about" className={cx('item-link', 'about')} activeClassName={cx('active')}>About</Link>
          </li>
          <li className={cx('item')}>
            <Link to="/data" className={cx('item-link', 'data')} activeClassName={cx('active')}>Data</Link>
          </li>
          <li className={cx('item')}>
            <Icon name="search" onClick={ activateSearch } />
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
