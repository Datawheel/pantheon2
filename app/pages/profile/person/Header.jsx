import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';

const Header = ({ pageviews, person }) => {
  // NOTE:
  // pageviews = data for spark line
  // each row = {num_pageviews: x, pageview_date: "YYYY-MM-DDT00:00:00", person: ID}
  // console.log(pageviews)

  return (
    <header>
      <div className='bgImg'>
        <div className='bgImg-l' style={{backgroundImage: `url('/people/${person.wiki_id}.jpg')`}}></div>
        <div className='bgImg-r' style={{backgroundImage: `url('/people/${person.wiki_id}.jpg')`}}></div>
      </div>
      <div className='info'>
        <p className='topDesc'>Cultural Memory of</p>
        <h2 className='topSubtitle'>{person.occupation.name}</h2>
        <h1 className='title'>{person.name}</h1>
        <p className='bottomSubtitle'>{person.birthyear.name} {person.deathyear ? `— ${person.deathyear.name}` : null}</p>
        <pre>[VIZ] SPARK LINE HERE</pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  person: PropTypes.object
};

export default Header;
