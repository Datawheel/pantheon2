import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const PeopleRanking = ({ ranking }) => {
  // console.log(ranking)
  // return (<div>rankking here...</div>)
  return (
    <div>
      <p>
        Between [year of 1st person born here] and [year of last person born here or present], the United Kingdom was the birth place of 132 globally memorable people, including JK Rowling, Keira Knightley, and Steven Hawking. Interestingly, a significantly greater amount of globally remembered people passed away in the UK, including Albert Einstein, Bono, and Archimedes.
      </p>
      <div className={'rank-title'}>
        <h3>Born in MAGICAL PLACEHOLDER</h3>
        <a href='#'>Go to all Rankings</a>
      </div>
      <ul className={'rank-list'}>
        {ranking.map((person) =>
          <li key={person.id}>
            <div className={'rank-photo'}>
              <img src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
            </div>
            <h2><a href={`/profile/person/${person.slug}/`}>{person.name}</a></h2>
            <p className={'rank-year'}>{person.birthyear} - {person.deathyear ? `${person.deathyear}` : 'Present'}</p>
          </li>
        )}
      </ul>
      <div className={'rank-sec-body'}>
        <div className={'rank-title'}>
          <h3>Deceased in MAGICAL PLACEHOLDER</h3>
          <a href='#'>Go to all Rankings</a>
        </div>
        <ul className={'rank-list'}></ul>
        <h2>missing dead people plz</h2>
      </div>
    </div>
  )
}

export default PeopleRanking;
