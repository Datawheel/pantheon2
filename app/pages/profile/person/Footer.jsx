import React from "react";
import {FORMATTERS} from "types";
import "pages/profile/common/Footer.css";

const Footer = ({person, ranking, wikiRelated}) => {
  const me = ranking.findIndex(p => p.wp_id === person.wp_id);
  const aboveMe = ranking[me + 1];
  const belowMe = ranking[me - 1];

  return (
    <footer className="profile-footer">
      <div className="footer-container">
        <h4 className="footer-title">Related Profiles</h4>
        <ul className="footer-carousel-container">
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a href={`/profile/occupation/${person.occupation.occupation_slug}`} style={{backgroundImage: `url(/images/profile/occupation/${person.occupation.occupation_slug}.jpg)`}}></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
            </h4>
            <p>{person.occupation.num_born} Individuals</p>
          </li>

          {belowMe
            ? <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href={`/profile/person/${belowMe.slug}`} style={{backgroundImage: `url(/images/profile/people/${belowMe.id}.jpg)`}}></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${belowMe.slug}`}>{belowMe.name}</a>
              </h4>
              <p>Rank {FORMATTERS.commas(belowMe.occupation_rank)}</p>
            </li>
            : null }

          {aboveMe
            ? <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href={`/profile/person/${aboveMe.slug}`} style={{backgroundImage: `url(/images/profile/people/${aboveMe.id}.jpg)`}}></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${aboveMe.slug}`}>{aboveMe.name}</a>
              </h4>
              <p>Rank {FORMATTERS.commas(aboveMe.occupation_rank)}</p>
            </li>
            : null }

          {person.birthplace
            ? <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href={`/profile/place/${person.birthplace.slug}`} style={{backgroundImage: `url(/images/profile/place/${person.birthcountry.id}.jpg)`}}>
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.place}</a>
              </h4>
              <p>{person.birthplace.num_born} Individuals</p>
            </li>
            : null }

          {person.birthcountry
            ? <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo" style={{backgroundImage: `url(/place/${person.birthcountry.id}.jpg)`}}>
                <a href={`/profile/place/${person.birthcountry.slug}`} style={{backgroundImage: `url(/images/profile/place/${person.birthcountry.id}.jpg)`}}></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>
              </h4>
              <p>{person.birthcountry.num_born} Individuals</p>
            </li>
            : null }

          {wikiRelated.length
            ? wikiRelated.map(relatedBio =>
              <li className="footer-carousel-item" key={relatedBio.id}>
                <div className="footer-carousel-item-photo">
                  <a href={`/profile/person/${relatedBio.slug}`} style={{backgroundImage: `url(/images/profile/people/${relatedBio.id}.jpg)`}}></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href={`/profile/person/${relatedBio.slug}`}>{relatedBio.name}</a>
                </h4>
                <p>{relatedBio.occupation.toLowerCase()}</p>
              </li>
            )
            : null}

        </ul>
      </div>
    </footer>
  );
};

export default Footer;
