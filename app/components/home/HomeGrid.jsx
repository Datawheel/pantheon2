import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {activateSearch} from "actions/nav";
import "css/components/home/homegrid";
import searchSvg from "images/icons/icon-search.svg";

const HomeGrid = ({activateSearch}) =>
    <div className="profile-grid">
      <h4 className="grid-title">Explore People, Places, Occupations, and Eras</h4>
      <ul className="grid-row">
        <li className="grid-box">
          <a href="/profile/person/ada_lovelace">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img ada scitech"></div>
              </div>
            </div>
            <h3>Ada Lovelace</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/salvador_dali">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img dali arts"></div>
              </div>
            </div>
            <h3>Salvador Dali</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/tutankhamun">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img tut inst"></div>
              </div>
            </div>
            <h3>Tutankhamun</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/usain_bolt">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img ubolt sports"></div>
              </div>
            </div>
            <h3>Usain Bolt</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/era/printing">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img print pubfig"></div>
              </div>
            </div>
            <h3>Printing Era</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/buenos_aires">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img bair"></div>
              </div>
            </div>
            <h3>Buenos Aires</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/krishna">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img krishna pubfig"></div>
              </div>
            </div>
            <h3>Krishna</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/cara_delevingne">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img cara arts"></div>
              </div>
            </div>
            <h3>Cara Delevingne</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/mahatma_gandhi">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img gandhi pubfig"></div>
              </div>
            </div>
            <h3>Mahatma Gandhi</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/albert_einstein">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img ein scitech"></div>
              </div>
            </div>
            <h3>Albert Einstein</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/occupation/architect">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img arch arts"></div>
              </div>
            </div>
            <h3>Architects</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/occupation/writer">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img writers hum"></div>
              </div>
            </div>
            <h3>Writers</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/occupation/linguist">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img linguists hum"></div>
              </div>
            </div>
            <h3>Linguists</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/occupation/film_director">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img fdir arts"></div>
              </div>
            </div>
            <h3>Film Directors</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/new_york_city">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img nyc"></div>
              </div>
            </div>
            <h3>New York City</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/aung_san_suu_kyi/">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img aung pubfig"></div>
              </div>
            </div>
            <h3>Aung San Suu Kyi</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/mao_zedong">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img mao inst"></div>
              </div>
            </div>
            <h3>Mao Zedong</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/london">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img london"></div>
              </div>
            </div>
            <h3>London</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/occupation/explorer">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img explorers expl"></div>
              </div>
            </div>
            <h3>Explorers</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/berlin">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img berlin"></div>
              </div>
            </div>
            <h3>Berlin</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/muhammad">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask" >
                <div className="grid-box-bg-img muhammad inst"></div>
              </div>
            </div>
            <h3>Muhammad</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/stephen_hawking">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img hawk scitech"></div>
              </div>
            </div>
            <h3>Stephen Hawking</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/tokyo">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img tokyo"></div>
              </div>
            </div>
            <h3>Tokyo</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/cesaria_evora">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img evora arts"></div>
              </div>
            </div>
            <h3>Cesária Évora</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/aishwarya_rai_bachchan">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask" >
                <div className="grid-box-bg-img aish arts"></div>
              </div>
            </div>
            <h3>Aishwarya Rai Bachchan</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/mark_zuckerberg">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img mark biz"></div>
              </div>
            </div>
            <h3>Mark Zuckerberg</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/moscow">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img moscow"></div>
              </div>
            </div>
            <h3>Moscow</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/ronaldo">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img ron sports"></div>
              </div>
            </div>
            <h3>Ronaldo</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/gautama_buddha">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask" >
                <div className="grid-box-bg-img budd hum"></div>
              </div>
            </div>
            <h3>Gautama Buddha</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/karl_marx">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img marx scitech"></div>
              </div>
            </div>
            <h3>Karl Marx</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/jet_li">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img jet arts"></div>
              </div>
            </div>
            <h3>Jet Li</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/place/istanbul">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img istanbul"></div>
              </div>
            </div>
            <h3>Istanbul</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/ban_kimoon">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask" >
                <div className="grid-box-bg-img ban inst"></div>
              </div>
            </div>
            <h3>Ban Ki-Moon</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/george_maxwell_richards">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img gmr inst"></div>
              </div>
            </div>
            <h3>George Maxwell Richards</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/yulia_tymoshenko">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img yulia inst"></div>
              </div>
            </div>
            <h3>Yulia Tymoshenko</h3>
          </a>
        </li>
        <li className="grid-box">
          <a href="/profile/person/frida_kahlo">
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className="grid-box-bg-img frida arts"></div>
              </div>
            </div>
            <h3>Frida Kahlo</h3>
          </a>
        </li>
      </ul>
    </div>
  ;

HomeGrid.propTypes = {
  activateSearch: PropTypes.func.isRequired
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {activateSearch})(HomeGrid);
