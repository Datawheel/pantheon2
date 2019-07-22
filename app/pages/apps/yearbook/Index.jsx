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

  render() {
    const {children} = this.props;

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
      {children}
    </div>;
  }

}
export default YearbookIndex;
