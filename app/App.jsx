import React, { Component } from "react";
import PropTypes from "prop-types";
import Navigation from "components/Navigation";
import Footer from "components/Footer";
import Search from "components/Search";
import "./App.css";
import "components/common/tooltip.css";
import GameAlert from "pages/banner/GameAlert";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: undefined,
      searchActive: false,
    };
  }

  getChildContext() {
    return { activateSearch: this.activateSearch };
  }

  componentDidMount() {
    let page;
    if (this.props.location.pathname === "/") {
      page = "app home";
    } else if (this.props.location.pathname === "/explore/rankings") {
      page = "app rankings";
    } else if (this.props.location.pathname === "/explore/viz") {
      page = "app explorer";
    } else {
      page = "app";
    }
    this.setState({ page });

    document.addEventListener(
      "keydown",
      () => {
        // 's' key
        if (event.keyCode === 83) {
          if (event.target.tagName !== "INPUT") {
            event.preventDefault();
            this.activateSearch();
          }
        }
      },
      false
    );
  }

  _closeSearchEscKey = (event) => {
    // 'esc' key
    if (event.keyCode === 27) {
      event.preventDefault();
      this.activateSearch();
    }
  };

  activateSearch = (e) => {
    const { searchActive } = this.state;
    if (e) {
      e.preventDefault();
    }
    // user wants to close the search
    if (searchActive) {
      document.body.classList.remove("noscroll");
      document.removeEventListener("keydown", this._closeSearchEscKey, false);
    } else {
      // user wants to open the search
      document.body.classList.add("noscroll");
      document.addEventListener("keydown", this._closeSearchEscKey, false);
    }
    this.setState({ searchActive: !searchActive });
  };

  render() {
    const { page, searchActive } = this.state;
    const { children } = this.props;

    // conditional for screenshots to remove all extraneous design
    if (this.props.location.pathname.match(/screenshot[\/]{0,1}$/)) {
      return (
        <div id="App" className="screenshot container">
          <div className="ss-logo-container">
            <img
              className="logo"
              src="/images/logos/logo_pantheon.svg"
              alt="Pantheon"
            />
          </div>
          <div>{children}</div>
        </div>
      );
    }

    // conditional for embeds to remove all extraneous design including logo
    if (this.props.location.pathname.includes("viz/embed")) {
      return (
        <div id="App" className={`${page} embed container`}>
          <div>{children}</div>
        </div>
      );
    }

    return (
      <div id="App" className={`${page} container`}>
        <GameAlert />
        {searchActive ? <Search activateSearch={this.activateSearch} /> : null}
        <Navigation activateSearch={this.activateSearch} />
        <div>{children}</div>
        <Footer />
      </div>
    );
  }
}

App.childContextTypes = {
  activateSearch: PropTypes.func,
};

export default App;
