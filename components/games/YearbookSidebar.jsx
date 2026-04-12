"use client";
import {Fragment, useState} from "react";
import {useRouter, useParams, usePathname} from "next/navigation";
import Link from "next/link";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";

import "../../styles/Misc.css";
import "../../styles/About.css";
import "./YearbookSidebar.css";

export default function YearbookSidebar({year}) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  // Determine locale from params or pathname
  const getLocale = () => {
    if (params?.locale && SUPPORTED_LOCALES.includes(params.locale)) {
      return params.locale;
    }
    const pathMatch = pathname?.match(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(/|$)`));
    if (pathMatch) {
      return pathMatch[1];
    }
    return DEFAULT_LOCALE;
  };
  const locale = getLocale();
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const decade = year ? Math.floor(year / 10) * 10 : 1900;
  const [openDecade, setOpenDecade] = useState(decade);

  const changeYear = event => {
    const selectedValue = event.target.value;
    router.push(`${localePrefix}/game/yearbook/${selectedValue}`);
  };

  return (
    <Fragment>
      <nav className="page-nav" role="navigation">
        <ul className="page-items">
          {[...Array(12).keys()].reverse().map(decade => {
            const decadeYear = 1900 + decade * 10;
            const isOpen = openDecade === decadeYear;
            return (
              <li className="item" key={decade}>
                <button
                  className="decade-toggle"
                  onClick={() => setOpenDecade(decadeYear)}
                >
                  <span className={`decade-chevron ${isOpen ? "open" : ""}`}>&#9656;</span>
                  {decadeYear}s
                </button>
                <div className={`collapse-panel ${isOpen ? "open" : ""}`}>
                  <ul className="inner-page-items">
                    {[...Array(10).keys()].reverse().map(yearIndex => (
                      <li key={decadeYear + yearIndex}>
                        <Link
                          href={`${localePrefix}/game/yearbook/${decadeYear + yearIndex}`}
                          className="item-link"
                        >
                          {decadeYear + yearIndex}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav className="mobile-page-nav" role="navigation">
        <div className="next">
          {parseInt(year, 10) < 2000 ? (
            <Link
              href={`${localePrefix}/game/yearbook/${parseInt(year, 10) + 1}`}
              className="yearbook-nav-btn"
            >
              &#8249; {parseInt(year, 10) + 1}
            </Link>
          ) : null}
        </div>

        <div className="drop">
          <select value={year} onChange={changeYear}>
            {[...Array(100).keys()].reverse().map(yearIndex => (
              <option key={yearIndex + 1900} value={yearIndex + 1900}>
                {yearIndex + 1900}
              </option>
            ))}
          </select>
        </div>
        <div className="prev">
          {parseInt(year, 10) > 1900 ? (
            <Link
              href={`${localePrefix}/game/yearbook/${parseInt(year, 10) - 1}`}
              className="yearbook-nav-btn"
            >
              {parseInt(year, 10) - 1} &#8250;
            </Link>
          ) : null}
        </div>
      </nav>
    </Fragment>
  );
}
