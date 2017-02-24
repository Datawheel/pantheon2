import React from "react";

const Footer = ({person, ranking}) => {
  const me = ranking.peers.findIndex(p => p.id === ranking.me.id);
  const aboveMe = ranking.peers[me + 1];
  const belowMe = ranking.peers[me - 1];

  console.log(aboveMe, belowMe)

  return (
    <footer className="profile-footer">
      <div className="footer-container">
        <h4 className="footer-title">Related Profiles</h4>
        <ul className="footer-carousel-container">
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a href={`/profile/occupation/${person.occupation.occupation_slug}`} style={{backgroundImage: `url(/occupation/${person.occupation.occupation_slug}.jpg)`}}></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
            </h4>
            <p>{person.occupation.num_born} Individuals</p>
          </li>

          { belowMe ? <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href={`/profile/person/${belowMe.slug}`} style={{backgroundImage: `url(/people/${belowMe.id}.jpg)`}}></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${belowMe.slug}`}>{belowMe.name}</a>
              </h4>
              <p>Rank {belowMe.occupation_rank}</p>
            </li>
          : null }

          { aboveMe ? <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href={`/profile/person/${aboveMe.slug}`} style={{backgroundImage: `url(/people/${aboveMe.id}.jpg)`}}></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${aboveMe.slug}`}>{aboveMe.name}</a>
              </h4>
              <p>Rank {aboveMe.occupation_rank}</p>
            </li>
          : null }

          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a href={`/profile/place/${person.birthplace.slug}`} style={{backgroundImage: `url(/place/${person.birthcountry.id}.jpg)`}}>
              </a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>
            </h4>
            <p>{person.birthplace.num_born} Individuals</p>
          </li>

          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo" style={{backgroundImage: `url(/place/${person.birthcountry.id}.jpg)`}}>
              <a href={`/profile/place/${person.birthcountry.slug}`} style={{backgroundImage: `url(/place/${person.birthcountry.id}.jpg)`}}></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>
            </h4>
            <p>{person.birthcountry.num_born} Individuals</p>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
