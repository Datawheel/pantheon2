import React from "react";
// import Helmet from "react-helmet";
// import config from "helmconfig.js";
import "components/NotFound.css";

const NotFound = ({activateSearch}) => {

  const messages = ["Sorry", "Mi dispiace", "Lo siento", "Désolé", "Fyrirgefðu", "Es sinto muito", "Het spijt me", "Es tut mir Leid", "συγγνώμη", "Anteeksi", "Przepraszam", "أنا آسف", "对不起", "죄송 해요", "прости", "ごめんなさい", "ខ្ញុំ​សុំទោស", "Tôi xin lôi"];
  const rand = Math.floor(Math.random() * messages.length);

  return (
    <div className="not-found">
      {/*<Helmet
        htmlAttributes={{lang: "en", amp: undefined}}
        title="🍳 Error 404 - Pantheon"
        meta={config.meta}
        link={config.link}
      />*/}
      <div className="error-banner" style={{backgroundImage: "url('/images/not-found/super.gif')"}}></div>
      <div className="error-container">
        <h2 className="error-msg">{messages[rand]}, page not found.</h2>
        <div className="profile-footer">
          <div className="footer-container">
            <h4 className="footer-title">You can try a new <a onClick={ activateSearch }><img src="/images/icons/icon-search-w.svg" alt="Search" />Search</a> or these Pages instead:</h4>
            <ul className="footer-carousel-container">
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/isaac_newton" className="error-photo newton"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/isaac_newton">Isaac Newton</a>
                </h4>
                <p>Physicist</p>
                <p>United Kingdom</p>
                <p>Rank 6</p>
              </li>
              <li className="footer-carousel-item page">
                <div className="footer-carousel-item-photo">
                  <a href="/explore/rankings" className="error-photo"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/explore/rankings">Pantheon Rankings</a>
                </h4>
                <p>How to all 2366 individuals stack up?</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/walt_disney" className="error-photo disney"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/walt_disney">Walt Disney</a>
                </h4>
                <p>Producer</p>
                <p>United States</p>
                <p>Rank 82</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/roger_federer" className="error-photo federer"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/roger_federer">Roger Federer</a>
                </h4>
                <p>Tennis Player</p>
                <p>Switzerland</p>
                <p>Rank 124</p>
              </li>
              <li className="footer-carousel-item page">
                <div className="footer-carousel-item-photo">
                  <a href="/data/datasets" className="error-photo"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/data/datasets">Download Datasets</a>
                </h4>
                <p>Dive into the data that makes up Pantheon!</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/occupation/racing_driver" className="error-photo sports"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/occupation/racing_driver">Racing Driver</a>
                </h4>
                <p>Occupation Rank 16</p>
                <p>665 Individuals</p>
                <p>Sports Domain</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/agnez_mo" className="error-photo agnez"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/agnez_mo">Agnez Mo</a>
                </h4>
                <p>Actor</p>
                <p>Indonesia</p>
                <p>Rank 63</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/laozi" className="error-photo laozi"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/laozi">Laozi</a>
                </h4>
                <p>Philosopher</p>
                <p>China</p>
                <p>Rank 157</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/vincent_van_gogh" className="error-photo vangogh"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/vincent_van_gogh">Vincent Van Gogh</a>
                </h4>
                <p>Painter</p>
                <p>Netherlands</p>
                <p>Rank 20</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/occupation/fashion_designer" className="error-photo arts"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/occupation/fashion_designer">Fashion Designer</a>
                </h4>
                <p>Occupation Rank 70</p>
                <p>35 Individuals</p>
                <p>Arts Domain</p>
              </li>
              <li className="footer-carousel-item page">
                <div className="footer-carousel-item-photo">
                  <a href="/explore/viz" className="error-photo"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/explore/viz">Visualizations</a>
                </h4>
                <p>Create custom visualizations using the Pantheon dataset.</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/vasco_da_gama" className="error-photo dagama"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/vasco_da_gama">Vasco da Gama</a>
                </h4>
                <p>Explorer</p>
                <p>Portugal</p>
                <p>Rank 99</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/occupation/celebrity" className="error-photo publicfigure"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/occupation/celebrity">Celebrity</a>
                </h4>
                <p>Occupation Rank 40</p>
                <p>142 Individuals</p>
                <p>Public Figure Domain</p>
              </li>
              <li className="footer-carousel-item">
                <div className="footer-carousel-item-photo">
                  <a href="/profile/person/marie_curie" className="error-photo curie"></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a href="/profile/person/marie_curie">Marie Curie</a>
                </h4>
                <p>Chemist</p>
                <p>Poland</p>
                <p>Rank 64</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
