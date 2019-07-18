import React, {Component} from "react";
import {Link} from "react-router";
import Helmet from "react-helmet";
import {Collapse} from "@blueprintjs/core";

import "pages/about/Misc.css";
import "pages/about/About.css";

class YearbookIndex extends Component {

  constructor(props) {
    super(props);
    const {year} = this.props.params;
    this.state = {
      openDecade: year ? Math.floor(year / 10) * 10 : false
    };
  }

  componentDidUpdate() {
    const {year} = this.props.params;
    console.log("YEARRRRR", year);
    if (!year) {
      const randomYear = Math.round(Math.random() * (1999 - 1900) + 1900);
      this.props.router.push(`/app/yearbook/${randomYear}`);
    }
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
              <a href="#" onClick={this.handleClick(1900 + decade * 10)}>{1900 + decade * 10}s</a>
              <Collapse isOpen={this.state.openDecade === 1900 + decade * 10}>
                <ul className="page-items">
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
