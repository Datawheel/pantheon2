import React from "react";
import "pages/profile/common/Footer.css";

const Footer = () =>
  <footer className="profile-footer">
    <div className="footer-container">
      <h4 className="footer-title">Keep Exploring</h4>
      <ul className="footer-carousel-container">
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/Isaac_Newton/" className="newton">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/Isaac_Newton/">Isaac Newton</a>
          </h4>
          <p>Physicist</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/Roger_Federer/" className="federer">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/Roger_Federer/">Roger Federer</a>
          </h4>
          <p>Tennis Player</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/Marie_Curie/" className="curie">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/Marie_Curie/">Marie Curie</a>
          </h4>
          <p>Chemist</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/Walt_Disney/" className="disney">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/Walt_Disney/">Walt Disney</a>
          </h4>
          <p>Producer</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/Laozi" className="laozi">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/Laozi">Laozi</a>
          </h4>
          <p>Philosopher</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/Vincent_van_Gogh" className="vangogh">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/Vincent_van_Gogh">Vincent Van Gogh</a>
          </h4>
          <p>Painter</p>
        </li>
      </ul>
    </div>
  </footer>;

export default Footer;
