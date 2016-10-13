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
          <li>
            <Link to="/explore" className={cx('item')} activeClassName={cx('active')}>Explore</Link>
          </li>
          <li>
            <Link to="/profile" className={cx('item')} activeClassName={cx('active')}>Profiles</Link>
          </li>
          <li>
            <Link to="/" className={cx('item', 'logo')} activeClassName={cx('active')}>Pantheon</Link>
          </li>
          <li>
            <Link to="/about" className={cx('item')} activeClassName={cx('active')}>About</Link>
          </li>
          <li>
            <Link to="/data" className={cx('item')} activeClassName={cx('active')}>Data</Link>
          </li>
          <li>
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
