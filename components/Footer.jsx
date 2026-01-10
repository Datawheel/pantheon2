"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useParams} from "next/navigation";
import {SUPPORTED_LOCALES, LOCALE_NATIVE_NAMES, DEFAULT_LOCALE} from "/app/locales";

const Footer = () => {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params?.locale || DEFAULT_LOCALE;
  const lang = SUPPORTED_LOCALES.includes(currentLocale) ? currentLocale : DEFAULT_LOCALE;

  // Get the current path without locale prefix for language switching
  const pathWithoutLocale = pathname?.replace(`/${lang}`, "") || "/";

  return (
  <>
  <div className="global-footer">
    <ul className="items site-map">
      <li className="item">
        <Link href="/explore/viz" className="item-link explore-link">
          Explore
        </Link>
        <ul className="sub-items">
          <li>
            <a href="/explore/viz" className="item-link">
              Visualizations
            </a>
          </li>
          <li>
            <a href="/explore/rankings" className="item-link">
              Rankings
            </a>
          </li>
        </ul>
      </li>

      <li className="item">
        <Link href="/profile/person" className="item-link profiles-link">
          Profiles
        </Link>
        <ul className="sub-items">
          <li>
            <a href="/profile/person" className="item-link">
              People
            </a>
          </li>
          <li>
            <a href="/profile/place" className="item-link">
              Places
            </a>
          </li>
          <li>
            <a href="/profile/country" className="item-link">
              Countries
            </a>
          </li>
          <li>
            <a href="/profile/occupation" className="item-link">
              Occupations
            </a>
          </li>
          <li>
            <a href="/profile/select-occupation-country" className="item-link">
              Occupations / Countries
            </a>
          </li>
          <li>
            <a href="/profile/era" className="item-link">
              Eras
            </a>
          </li>
        </ul>
      </li>

      {/* <li className="item">
        <Link href="/about/vision" className="item-link about-link">About</Link>
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
        <Link href="/data/faq" className="item-link about-link">
          About
        </Link>
        <ul className="sub-items">
          <li>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdHKWwONdugZfwQvCvkSHakG-xeFh_HOZcvK3NqVOv19h0-jQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="item-link"
            >
              Report Data Error
            </a>
          </li>
          <li>
            <Link href="/about/privacy" className="item-link about-link">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/about/terms" className="item-link about-link">
              Terms of Service
            </Link>
          </li>
        </ul>
      </li>

      <li className="item">
        <Link href="/data/permissions" className="item-link data-link">
          Data
        </Link>
        <ul className="sub-items">
          <li>
            <a href="/data/permissions" className="item-link">
              Permissions
            </a>
          </li>
          <li>
            <a href="/data/datasets" className="item-link">
              Download
            </a>
          </li>
          <li>
            <Link href="/data/api" className="item-link api-link">
              API
            </Link>
          </li>
        </ul>
      </li>

      <li className="item">
        <Link href="/game/yearbook" className="item-link data-link">
          Apps
        </Link>
        <ul className="sub-items">
          <li>
            <a href="/game/yearbook" className="item-link">
              Yearbook
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
