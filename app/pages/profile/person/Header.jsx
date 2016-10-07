import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Header = ({ person }) => {

  return (
    <header>
      <div className={cx('bgImg')} style={{backgroundImage: `url('/people/${person.wiki_id}.jpg')`}}></div>
      <div className={cx('info')}>
        <p className={cx('topDesc')}>Cultural Memory of</p>
        <h2 className={cx('topSubtitle')}>{person.occupation.name}</h2>
        <h1 className={cx('title')}>{person.name}</h1>
        <p className={cx('bottomSubtitle')}>{person.birthyear.name} {person.deathyear ? `— ${person.deathyear.name}` : null}</p>
        <pre>[VIZ] SPARK LINE HERE</pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  person: PropTypes.object
};

export default Header;
