import React, {Component} from "react";
import PropTypes from "prop-types";
import Navigation from "components/Navigation";
import Footer from "components/Footer";
import Search from "components/Search";
import "./App.css";
import "components/common/tooltip.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: undefined,
      searchActive: false
    };
  }

  getChildContext() {
    return {activateSearch: this.activateSearch};
  }

  componentWillMount() {
    let page;
    if (this.props.location.pathname === "/") {
      page = "app home";
    }
    else if (this.props.location.pathname === "/explore/rankings") {
      page = "app rankings";
    }
    else if (this.props.location.pathname === "/explore/viz") {
      page = "app explorer";
    }
    else {
      page = "app";
    }
    this.setState({page});
  }

  componentDidMount() {
    document.addEventListener("keydown", () => {
      // 's' key
      if (event.keyCode === 83) {
        if (event.target.tagName !== "INPUT") {
          event.preventDefault();
          this.activateSearch();
        }
      }
      // 'esc' key
      if (event.keyCode === 27) {
        event.preventDefault();
        this.activateSearch();
      }
    }, false);
  }

  activateSearch = () => {
    this.setState({searchActive: !this.state.searchActive});
  }

  render() {
    const {page, searchActive} = this.state;
    const {children} = this.props;

    // conditional for screenshots to remove all extraneous design
    if (this.props.location.pathname.match(/screenshot[\/]{0,1}$/)) {
      return (
        <div id="App" className="screenshot container">
          <div className="ss-logo-container">
            <img className="logo" src="/images/logos/logo_pantheon.svg" alt="Pantheon" />
          </div>
          <div>{children}</div>
        </div>
      );
    }

    return (
      <div id="App" className={`${page} container`}>
        {searchActive ? <Search activateSearch={this.activateSearch} /> : null}
        <Navigation activateSearch={this.activateSearch} />
        <div>{children}</div>
        <Footer />
      </div>
    );
  }
}

App.childContextTypes = {
  activateSearch: PropTypes.func
};

export default App;
