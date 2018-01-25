import React from "react";
import "css/components/profile/footer";

const Footer = () =>
  <footer className="profile-footer">
    <div className="footer-container">
      <h4 className="footer-title">Keep Exploring</h4>
      <ul className="footer-carousel-container">
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/isaac_newton/" className="newton">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/isaac_newton/">Isaac Newton</a>
          </h4>
          <p>Physicist</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/roger_federer/" className="federer">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/roger_federer/">Roger Federer</a>
          </h4>
          <p>Tennis Player</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/marie_curie/" className="curie">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/marie_curie/">Marie Curie</a>
          </h4>
          <p>Chemist</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/walt_disney/" className="disney">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/walt_disney/">Walt Disney</a>
          </h4>
          <p>Producer</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/laozi" className="laozi">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/laozi">Laozi</a>
          </h4>
          <p>Philosopher</p>
        </li>
        <li className="footer-carousel-item">
          <div className="footer-carousel-item-photo">
            <a href="/profile/person/vincent_van_gogh" className="vangogh">
            </a>
          </div>
          <h4 className="footer-carousel-item-title">
            <a href="/profile/person/vincent_van_gogh">Vincent Van Gogh</a>
          </h4>
          <p>Painter</p>
        </li>
      </ul>
    </div>
  </footer>;

export default Footer;
