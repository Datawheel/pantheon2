"use client";
import {Fragment, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {AnchorButton, Collapse} from "@blueprintjs/core";

import "../../styles/Misc.css";
import "../../styles/About.css";

export default function YearbookSidebar({year}) {
  const router = useRouter();
  const decade = year ? Math.floor(year / 10) * 10 : 1900;
  const [openDecade, setOpenDecade] = useState(decade);

  const changeYear = event => {
    // Get the selected value
    const selectedValue = event.target.value;
    // Update the URL
    router.push(`/game/yearbook/${selectedValue}`);
  };

  return (
    <Fragment>
      <nav className="page-nav" role="navigation">
        <ul className="page-items">
          {[...Array(12).keys()].reverse().map(decade => (
            <li className="item" key={decade}>
              <AnchorButton
                text={`${1900 + decade * 10}s`}
                icon={
                  openDecade === 1900 + decade * 10
                    ? "chevron-down"
                    : "chevron-right"
                }
                minimal={true}
                onClick={() => setOpenDecade(1900 + decade * 10)}
              />
              <Collapse isOpen={openDecade === 1900 + decade * 10}>
                <ul className="inner-page-items">
                  {[...Array(10).keys()].reverse().map(yearIndex => (
                    <li key={1900 + decade * 10 + yearIndex}>
                      <Link
                        href={`/game/yearbook/${
                          1900 + decade * 10 + yearIndex
                        }`}
                        className="item-link"
                      >
                        {1900 + decade * 10 + yearIndex}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="mobile-page-nav" role="navigation">
        <div className="next">
          {parseInt(year, 10) < 2000 ? (
            <Link
              href={`/game/yearbook/${parseInt(year, 10) + 1}`}
              className="bp3-button bp3-minimal bp3-icon-chevron-left"
            >
              {parseInt(year, 10) + 1}
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
              href={`/game/yearbook/${parseInt(year, 10) - 1}`}
              className="bp3-button bp3-minimal"
            >
              {parseInt(year, 10) - 1}
              <span className="bp3-icon-standard bp3-icon-chevron-right"></span>
            </Link>
          ) : null}
        </div>
      </nav>
    </Fragment>
  );
}
