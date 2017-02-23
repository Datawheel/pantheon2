import React from 'react';
import { Link } from 'react-router';
import styles from "css/components/profile/footer";
import testProf from "images/test/prof.png";

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Profile = ({children}) => {
  const sampleProfiles = [
    {type:"person", slug:"Wendy_Carlos"},
    {type:"person", slug:"Katie_Couric"},
    {type:"person", slug:"Nostradamus"},
    {type:"person", slug:"Mikhail_Bulgakov"},
    {type:"place", slug:"Jefferson_Valley-Yorktown"},
    {type:"place", slug:"Paris"},
    {type:"place", slug:"Argentina"},
    {type:"place", slug:"Australia"},
    {type:"domain", slug:"architect"},
    {type:"domain", slug:"geologist"},
    {type:"domain", slug:"occultist"},
    {type:"domain", slug:"musician"},
  ];

  return (
    <div className="profile">
    {
      !children
      ? <ul>

        {sampleProfiles.map((profile) =>
          <li>
            <Link
              to={`/profile/${profile.type}/${profile.slug}`}
              key={profile.slug}
              className="item"
              activeClassName="active">
              {profile.slug}
            </Link>
          </li>
        )}

      </ul>
      : null
    }
    {children}

      <footer className="profile-footer">
        <div className="footer-container">
          <h4 className="footer-title">Related Profiles</h4>
          <ul className="footer-carousel-container">
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href="#">
                  <img src={testProf} alt={`Related profile link`} />
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href="#">JK Rowling</a>
              </h4>
              <p>Writer</p>
            </li>
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href="#">
                  <img src={testProf} alt={`Related profile link`} />
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href="#">Soccer Players</a>
              </h4>
              <p>Occupation</p>
            </li>
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href="#">
                  <img src={testProf} alt={`Related profile link`} />
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href="#">Mexico</a>
              </h4>
              <p>Country</p>
            </li>
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href="#">
                  <img src={testProf} alt={`Related profile link`} />
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href="#">Rome, Italy</a>
              </h4>
              <p>City</p>
            </li>
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href="#">
                  <img src={testProf} alt={`Related profile link`} />
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href="#">Ferdinand Magellan</a>
              </h4>
              <p>Explorer</p>
            </li>
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a href="#">
                  <img src={testProf} alt={`Related profile link`} />
                </a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href="#">Frida Kahlo</a>
              </h4>
              <p>Painter</p>
            </li>
          </ul>
        </div>
      </footer>

    </div>
  )
};

export default Profile;
