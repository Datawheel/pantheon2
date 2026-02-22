"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useParams} from "next/navigation";
import {useSearchVisibility} from "/contexts/SearchContext";
import {getTranslations} from "/app/translations";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "/app/locales";

export default function Navigation() {
  const {setSearchVisible} = useSearchVisibility();
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const [mobileSubnav, setMobileSubnav] = useState(null);

  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale || DEFAULT_LOCALE;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  const toggleSubNav = subnavType => {
    subnavType === mobileSubnav
      ? setMobileSubnav(null)
      : setMobileSubnav(subnavType);
  };

  return (
    <nav>
      <div id="navigation" className="globalNav navigation" role="navigation">
        <ul className="items">
          <li className="nav-btn" onClick={() => setMobileNavVisible(true)}>
            <span>
              <Image
                width={18}
                height={12}
                src="/images/icons/icon-nav.svg"
                alt="navigation hamburger menu"
              />
            </span>
          </li>
          <li className="item">
            <a href={`/${lang}/explore/viz`} className="item-link explore-link">
              {t.nav.visualizations}
            </a>
          </li>
          <li className="item">
            <a
              href={`/${lang}/explore/rankings?show=people`}
              className="item-link rankings-link dd"
            >
              {t.nav.rankings}
            </a>
            <ul className="sub-items">
              <li>
                <a href={`/${lang}/explore/rankings?show=people`} className="item-link">
                  {t.nav.people}
                </a>
              </li>
              <li>
                <a href={`/${lang}/explore/rankings?show=places`} className="item-link">
                  {t.nav.places}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/explore/rankings?show=occupations`}
                  className="item-link"
                >
                  {t.nav.occupations}
                </a>
              </li>
            </ul>
          </li>
          <li className="item">
            <a href={`/${lang}/profile/person`} className="item-link profiles-link dd">
              {t.nav.profiles}
            </a>
            <ul className="sub-items">
              <li>
                <a href={`/${lang}/profile/person`} className="item-link">
                  {t.nav.people}
                </a>
              </li>
              <li>
                <a href={`/${lang}/profile/born-on-this-day`} className="item-link">
                  {t.nav.bornOnThisDay || "Born on This Day"} <span className="new-badge">{t.nav.newBadge}</span>
                </a>
              </li>
              <li>
                <a href={`/${lang}/profile/place`} className="item-link">
                  {t.nav.places}
                </a>
              </li>
              <li>
                <a href={`/${lang}/profile/country`} className="item-link">
                  {t.nav.countries}
                </a>
              </li>
              <li>
                <a href={`/${lang}/profile/occupation`} className="item-link">
                  {t.nav.occupations}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/profile/select-occupation-country`}
                  className="item-link"
                >
                  {t.nav.occupationCountry}
                </a>
              </li>
              <li>
                <a href={`/${lang}/profile/era`} className="item-link">
                  {t.nav.eras}
                </a>
              </li>
              <li>
                <a href={`/${lang}/profile/deaths/2025`} className="item-link">
                  {t.nav.deaths}
                </a>
              </li>
            </ul>
          </li>
          <li className="item home-link">
            <a href={`/${lang}`} className="home">
              <Image
                width={140}
                height={20}
                className="logo"
                src="/images/logos/logo_pantheon.svg"
                alt="Pantheon"
              />
            </a>
          </li>
          {/* <li className="item">
              <Link href="/about/vision" className="item-link about-link dd" activeClassName="active">About</Link>
              <ul className="sub-items">
                <li><a href="/about/vision" className="item-link">Vision</a></li>
                <li><a href="/data/faq" className="item-link">FAQ</a></li>
                <li><a href="/about/team" className="item-link">Team</a></li>
                <li><a href="/about/publications" className="item-link">Publications</a></li>
                <li><a href="/about/methods" className="item-link">Methods</a></li>
                <li><a href="/about/data_sources" className="item-link">Data Sources</a></li>
                <li><a href="/about/contact" className="item-link">Contact</a></li>
              </ul>
            </li> */}
          <li className="item">
            <Link
              href={`/${lang}/data/faq`}
              className={
                pathname === `/${lang}/data/faq`
                  ? "active item-link about-link"
                  : "item-link about-link"
              }
            >
              {t.nav.about}
            </Link>
          </li>
          <li className="item">
            <Link
              href={`/${lang}/data/permissions`}
              className={
                pathname === `/${lang}/data/permissions`
                  ? "active item-link data-link dd"
                  : "item-link data-link dd"
              }
            >
              {t.nav.data}
            </Link>
            <ul className="sub-items">
              <li>
                <Link href={`/${lang}/data/permissions`} className="item-link">
                  {t.nav.permissions}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/data/datasets`} className="item-link">
                  {t.nav.download}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/data/api`} className="item-link">
                  {t.nav.api}
                </Link>
              </li>
            </ul>
          </li>
          <li className="item">
            <Link
              href={`/${lang}/game/yearbook`}
              className={
                pathname === `/${lang}/game/yearbook`
                  ? "active item-link explore-link dd"
                  : "item-link explore-link dd"
              }
            >
              {t.nav.games}
            </Link>
            <ul className="sub-items">
              <li>
                <Link href={`/${lang}/game/yearbook`} className="item-link">
                  {t.nav.yearbook}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/game/birthle`} className="item-link">
                  ◼ {t.nav.birthle}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/game/trivia`} className="item-link">
                  ◼ {t.nav.trivia}
                </Link>
              </li>
              <li>
                <a href="https://trivia.rocks/" target="_blank" rel="noopener noreferrer" className="item-link">
                  TuneTrivia <span className="new-badge">{t.nav.newBadge}</span>
                </a>
              </li>
            </ul>
          </li>
          <li className="item">
            <Link
              href={`/${lang}/news`}
              className={
                pathname?.startsWith(`/${lang}/news`) || pathname?.includes("/news")
                  ? "active item-link news-link"
                  : "item-link news-link"
              }
            >
              {t.nav.news}
            </Link>
          </li>
          <li className="search-btn">
            <button onClick={() => setSearchVisible(true)}>
              <Image
                width={18}
                height={18}
                src="/images/icons/icon-search.svg"
                alt={t.nav.search}
              />
            </button>
          </li>
        </ul>
      </div>
      {mobileNavVisible ? (
        <div className="globalNav mobileNavigation">
          <div className="logo-container">
            <a href={`/${lang}`} className="home">
              <Image
                width={93}
                height={13}
                className="logo"
                src="/images/logos/logo_pantheon.svg"
                alt="Pantheon"
              />
            </a>
            <span
              className="close-btn"
              onClick={() => setMobileNavVisible(false)}
            >
              <Image
                width={18}
                height={18}
                src="/images/icons/icon-close.svg"
                alt="close navigation"
              />
            </span>
          </div>
          <ul className="items">
            <li className="item">
              <a href={`/${lang}`} className="item-link home-link">
                {t.nav.home}
              </a>
            </li>
            <li className="item">
              <a href={`/${lang}/explore/viz`} className="item-link explore-link">
                {t.nav.visualizations}
              </a>
            </li>
            <li className="item">
              <a href={`/${lang}/explore/rankings`} className="item-link rankings-link">
                {t.nav.rankings}
              </a>
            </li>
            <li className="item" onClick={() => toggleSubNav("profiles")}>
              <a
                className="item-link profiles-link"
                onClick={e => e.preventDefault()}
              >
                {t.nav.profiles}
              </a>
              {mobileSubnav === "profiles" ? (
                <ul className="sub-items">
                  <li>
                    <a href={`/${lang}/profile/person`}>{t.nav.people}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/born-on-this-day`}>
                      {t.nav.bornOnThisDay || "Born on This Day"} <span className="new-badge">{t.nav.newBadge}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/place`}>{t.nav.places}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/country`}>{t.nav.countries}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/occupation`}>{t.nav.occupations}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/select-occupation-country`}>
                      {t.nav.occupationCountry}
                    </a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/era`}>{t.nav.eras}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/profile/deaths/2025`}>{t.nav.deaths}</a>
                  </li>
                </ul>
              ) : null}
            </li>
            {/* <li className="item" onClick={this.toggleSubNav}>
              <a className="item-link about-link" onClick={this.toggleSubNavSib}>About</a>
              <ul className="sub-items">
                <li><a href="/about/vision">Vision</a></li>
                <li><a href="/data/faq">FAQ</a></li>
                <li><a href="/about/team">Team</a></li>
                <li><a href="/about/publications">Publications</a></li>
                <li><a href="/about/methods">Methods</a></li>
                <li><a href="/about/data_sources">Data Sources</a></li>
                <li><a href="/about/contact">Contact</a></li>
              </ul>
            </li> */}
            <li className="item">
              <a href={`/${lang}/data/faq`} className="item-link about-link">
                {t.nav.about}
              </a>
            </li>
            <li className="item" onClick={() => toggleSubNav("data")}>
              <a
                className="item-link data-link"
                onClick={e => e.preventDefault()}
              >
                {t.nav.data}
              </a>
              {mobileSubnav === "data" ? (
                <ul className="sub-items">
                  <li>
                    <a href={`/${lang}/data/permissions`}>{t.nav.permissions}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/data/datasets`}>{t.nav.download}</a>
                  </li>
                  <li>
                    <a href={`/${lang}/data/api`}>{t.nav.api}</a>
                  </li>
                </ul>
              ) : null}
            </li>
            <li className="item" onClick={() => toggleSubNav("games")}>
              <a
                className="item-link game-link"
                onClick={e => e.preventDefault()}
              >
                {t.nav.games}
              </a>
              {mobileSubnav === "games" ? (
                <ul className="sub-items">
                  <li>
                    <Link href={`/${lang}/game/yearbook`} className="item-link">
                      {t.nav.yearbook}
                    </Link>
                  </li>
                  <li>
                    <a href={`/${lang}/game/birthle`} className="item-link">
                      {t.nav.birthle}
                    </a>
                  </li>
                  <li>
                    <a href={`/${lang}/game/trivia`} className="item-link">
                      {t.nav.trivia}
                    </a>
                  </li>
                  <li>
                    <a href="https://trivia.rocks/" target="_blank" rel="noopener noreferrer" className="item-link">
                      TuneTrivia <span className="new-badge">{t.nav.newBadge}</span>
                    </a>
                  </li>
                </ul>
              ) : null}
            </li>
            <li className="item">
              <a href={`/${lang}/news`} className="item-link news-link">
                {t.nav.news}
              </a>
            </li>
            <li className="item">
              <a href={`/${lang}/data/api`} className="item-link api-link">
                {t.nav.api}
              </a>
            </li>
            <li
              className="item search-link item-link"
              onClick={() => setSearchVisible(true)}
            >
              {t.nav.search}
            </li>
            <li className="item">
              <a
                href="http://bit.ly/QWSKoc"
                target="_blank"
                rel="noopener noreferrer"
                className="item-link feedback-link"
              >
                {t.nav.giveFeedback}
              </a>
            </li>
            <li className="item item-link citation-link">
              {t.nav.usageCitation}
              <input
                readOnly
                type="text"
                value="Yu, A. Z., et al. (2016). Pantheon 1.0, a manually verified dataset of globally famous biographies. Scientific Data 2:150075. doi: 10.1038/sdata.2015.75"
              />
            </li>
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
