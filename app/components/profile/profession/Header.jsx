import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';
import sparklineSvg from 'images/sparkline.svg';
import placeholderImg from 'images/placeholder_prof_hero.jpg';

const Header = ({ profession, people }) => {

  return (
    <header className='hero'>
      <div className='bg-container'>
        <div className='bg-img-mask profession'>
          <div className='bg-img bg-img-t'>
            {people.slice(0, 4).map(p =>
              <img key={p.id} src={`/people/${p.wiki_id}.jpg`} />
            )}
          </div>
          <div className='bg-img bg-img-m'>
            {people.slice(5, 9).map(p =>
              <img key={p.id} src={`/people/${p.wiki_id}.jpg`} />
            )}
          </div>
          <div className='bg-img bg-img-b'>
            {people.slice(10, 14).map(p =>
              <img key={p.id} src={`/people/${p.wiki_id}.jpg`} />
            )}
          </div>
          <div className='bg-img-mask-after'></div>
        </div>
      </div>
      <div className='info'>
        <p className='top-desc'>Cultural Production of</p>
        <h2 className='profile-type'>Profession</h2>
        <h1 className='profile-name'>{profession.name}</h1>
        <pre>
          <img className='sparkline' src={sparklineSvg} alt={`Sparkline here`} />
        </pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  profession: PropTypes.object
};

export default Header;
