import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames/bind';
import styles from 'css/components/about';

const cx = classNames.bind(styles);

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Profile = ({children}) => {
  return (
    <div className={cx('profile')}>
      <h1 className={cx('header')}>Profiles</h1>
      <nav className={cx('subNav')} role="navigation">
        <Link to="/profile/person" className={cx('item')} activeClassName={cx('active')}>Person</Link>
        <Link to="/profile/geo" className={cx('item')} activeClassName={cx('active')}>Geo</Link>
        <Link to="/profile/domain" className={cx('item')} activeClassName={cx('active')}>Domain</Link>
      </nav>

      {children}
    </div>
  );
};

export default Profile;
