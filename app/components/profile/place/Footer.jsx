import React, { Component, PropTypes } from "react";
// import styles from "css/components/profile/footer";
// import { FORMATTERS } from "types";
import testProf from "images/test/prof.png";

const Footer = () => {

  return (
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
  );
}

export default Footer;
