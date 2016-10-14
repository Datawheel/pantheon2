import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';
import sparklineSvg from 'images/sparkline.svg';

const Header = ({ pageviews, person }) => {
  // NOTE:
  // pageviews = data for spark line
  // each row = {num_pageviews: x, pageview_date: "YYYY-MM-DDT00:00:00", person: ID}
  // console.log(pageviews)

  return (
    <header className='hero'>
      <div className='bg-container'>
        <div className='bg-img-mask'>
          <div className='bg-img bg-img-l' style={{backgroundImage: `url('/people/${person.wiki_id}.jpg')`}}></div>
          <div className='bg-img bg-img-r' style={{backgroundImage: `url('/people/${person.wiki_id}.jpg')`}}></div>
        </div>
      </div>
      <div className='info'>
        <p className='top-desc'>Cultural Memory of</p>
        <h2 className='profile-type'>{person.profession.name}</h2>
        <h1 className='profile-name'>{person.name}</h1>
        <p className='date-subtitle'>{person.birthyear.name} - {person.deathyear ? `${person.deathyear.name}` : "Present"}</p>
        <pre>
          <img className='sparkline' src={sparklineSvg} alt={`Sparkline here`} />
        </pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  person: PropTypes.object
};

export default Header;
