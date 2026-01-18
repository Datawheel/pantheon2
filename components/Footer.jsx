"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useParams} from "next/navigation";
import {SUPPORTED_LOCALES, LOCALE_NATIVE_NAMES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";

const Footer = () => {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params?.locale || DEFAULT_LOCALE;
  const lang = SUPPORTED_LOCALES.includes(currentLocale) ? currentLocale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  // Get the current path without locale prefix for language switching
  const pathWithoutLocale = pathname?.replace(`/${lang}`, "") || "/";

  return (
  <>
  <div className="global-footer">
    <ul className="items site-map">
      <li className="item">
        <Link href={`/${lang}/explore/viz`} className="item-link explore-link">
          {t.nav.explore}
        </Link>
        <ul className="sub-items">
          <li>
            <a href={`/${lang}/explore/viz`} className="item-link">
              {t.nav.visualizations}
            </a>
          </li>
          <li>
            <a href={`/${lang}/explore/rankings`} className="item-link">
              {t.nav.rankings}
            </a>
          </li>
        </ul>
      </li>

      <li className="item">
        <Link href={`/${lang}/profile/person`} className="item-link profiles-link">
          {t.nav.profiles}
        </Link>
        <ul className="sub-items">
          <li>
            <a href={`/${lang}/profile/person`} className="item-link">
              {t.nav.people}
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
            <a href={`/${lang}/profile/select-occupation-country`} className="item-link">
              {t.nav.occupationCountry}
            </a>
          </li>
          <li>
            <a href={`/${lang}/profile/era`} className="item-link">
              {t.nav.eras}
            </a>
          </li>
        </ul>
      </li>

      {/* <li className="item">
        <Link href={`/${lang}/about/vision`} className="item-link about-link">About</Link>
        <ul className="sub-items">
          <li><a href={`/${lang}/about/vision`} className="item-link">Vision</a></li>
          <li><a href={`/${lang}/data/faq`} className="item-link">FAQ</a></li>
          <li><a href={`/${lang}/about/team`} className="item-link">Team</a></li>
          <li><a href={`/${lang}/about/publications`} className="item-link">Publications</a></li>
          <li><a href={`/${lang}/about/methods`} className="item-link">Methods</a></li>
          <li><a href={`/${lang}/about/data_sources`} className="item-link">Data Sources</a></li>
          <li><a href={`/${lang}/about/contact`} className="item-link">Contact</a></li>
        </ul>
      </li> */}
      <li className="item">
        <Link href={`/${lang}/data/faq`} className="item-link about-link">
          {t.nav.about}
        </Link>
        <ul className="sub-items">
          <li>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdHKWwONdugZfwQvCvkSHakG-xeFh_HOZcvK3NqVOv19h0-jQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="item-link"
            >
              {t.nav.reportDataError}
            </a>
          </li>
          <li>
            <Link href={`/${lang}/about/privacy`} className="item-link about-link">
              {t.nav.privacyPolicy}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/about/terms`} className="item-link about-link">
              {t.nav.termsOfService}
            </Link>
          </li>
        </ul>
      </li>

      <li className="item">
        <Link href={`/${lang}/data/permissions`} className="item-link data-link">
          {t.nav.data}
        </Link>
        <ul className="sub-items">
          <li>
            <a href={`/${lang}/data/permissions`} className="item-link">
              {t.nav.permissions}
            </a>
          </li>
          <li>
            <a href={`/${lang}/data/datasets`} className="item-link">
              {t.nav.download}
            </a>
          </li>
          <li>
            <Link href={`/${lang}/data/api`} className="item-link api-link">
              {t.nav.api}
            </Link>
          </li>
        </ul>
      </li>

      <li className="item">
        <Link href={`/${lang}/game/yearbook`} className="item-link data-link">
          {t.nav.apps}
        </Link>
        <ul className="sub-items">
          <li>
            <a href={`/${lang}/game/yearbook`} className="item-link">
              {t.nav.yearbook}
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <div className="sites right">
      <ul className="items authors">
        <li>
          <a
            href="https://www.datawheel.us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={195}
              height={60}
              src="/images/logos/logo_datawheel.png"
              alt="Datawheel"
            />
          </a>
          <a
            href="https://centerforcollectivelearning.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={45}
              height={60}
              className="logoCL"
              src="/images/logos/logo_CL.svg"
              alt="CL"
            />
          </a>
        </li>
      </ul>
      <ul className="items share">
        <li>
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={80}
              height={15}
              src="/images/logos/logo_creative_commons.png"
              alt="Creative Commons"
            />
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/datawheel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={20}
              height={20}
              src="/images/logos/logo_facebook.svg"
              alt="Facebook"
            />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/PantheonW"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={20}
              height={20}
              src="/images/logos/logo_twitter.svg"
              alt="Creative Commons"
            />
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div className="language-switcher">
    {SUPPORTED_LOCALES.map((locale, index) => (
      <React.Fragment key={locale}>
        {index > 0 && <span className="separator">•</span>}
        <Link
          href={`/${locale}${pathWithoutLocale}`}
          className={locale === lang ? "active" : ""}
        >
          {LOCALE_NATIVE_NAMES[locale]}
        </Link>
      </React.Fragment>
    ))}
  </div>
  </>
  );
};

export default Footer;
