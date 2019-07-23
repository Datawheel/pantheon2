import React, {Component} from "react";
import {Link} from "react-router";
import Helmet from "react-helmet";
import {AnchorButton, Collapse} from "@blueprintjs/core";

import "pages/about/Misc.css";
import "pages/about/About.css";
import "pages/apps/yearbook/Yearbook.css";

class YearbookIndex extends Component {

  constructor(props) {
    super(props);
    const {year} = this.props.params;
    this.state = {
      openDecade: year ? Math.floor(year / 10) * 10 : false
    };
  }

  _ensureYear = year => {
    if (!year) {
      const randomYear = Math.round(Math.random() * (1999 - 1900) + 1900);
      this.props.router.push(`/app/yearbook/${randomYear}`);
    }
  }

  componentDidMount() {
    const {year} = this.props.params;
    this._ensureYear(year);
  }

  componentDidUpdate() {
    const {year} = this.props.params;
    this._ensureYear(year);
  }

  handleClick = decade => e => {
    e.preventDefault();
    this.setState({openDecade: decade});
  };

  changeYear = e => {
    this.props.router.push(`/app/yearbook/${e.target.value}`);
  }

  render() {
    const {children} = this.props;
    const {year} = this.props.params;

    return <div className="yearbook-page">
      <Helmet title="Pantheon Yearbook" />
      <nav className="page-nav" role="navigation">
        <ul className="page-items">
          {[...Array(10).keys()].reverse().map(decade =>
            <li className="item" key={decade}>
              <AnchorButton text={`${1900 + decade * 10}s`} icon={this.state.openDecade === 1900 + decade * 10 ? "chevron-down" : "chevron-right"} minimal={true} onClick={this.handleClick(1900 + decade * 10)} />
              <Collapse isOpen={this.state.openDecade === 1900 + decade * 10}>
                <ul className="inner-page-items">
                  {[...Array(10).keys()].reverse().map(yearIndex =>
                    <li key={1900 + decade * 10 + yearIndex}>
                      <Link to={`/app/yearbook/${1900 + decade * 10 + yearIndex}`} className="item-link" activeClassName="is-active">{1900 + decade * 10 + yearIndex}</Link>
                    </li>
                  )}
                </ul>
              </Collapse>
            </li>
          )}
        </ul>
      </nav>
      <nav className="mobile-page-nav" role="navigation">
        <div className="prev">
          {parseInt(year, 10) > 1900 ? <Link to={`/app/yearbook/${parseInt(year, 10) - 1}`} className="bp3-button bp3-minimal bp3-icon-chevron-left">{parseInt(year, 10) - 1}</Link> : null}
        </div>
        <div className="drop">
          <select value={year} onChange={this.changeYear}>
            {[...Array(100).keys()].reverse().map(yearIndex =>
              <option key={yearIndex + 1900} value={yearIndex + 1900}>{yearIndex + 1900}</option>
            )}
          </select>
        </div>
        <div className="next">
          {parseInt(year, 10) < 2000
            ? <Link to={`/app/yearbook/${parseInt(year, 10) + 1}`} className="bp3-button bp3-minimal">
              {parseInt(year, 10) + 1}
              <span className="bp3-icon-standard bp3-icon-chevron-right"></span>
            </Link>
            : null}
        </div>
      </nav>
      {children}
    </div>;
  }

}
export default YearbookIndex;
