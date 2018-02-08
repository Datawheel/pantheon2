import React, {Component} from "react";
import {CanonComponent} from "datawheel-canon";
import d3plus from "viz/d3plus";
import Navigation from "components/Navigation";
import Footer from "components/Footer";
import Search from "components/Search";
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: undefined,
      searchActive: false
    };
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
          this.props.activateSearch();
        }
      }
      // 'esc' key
      if (event.keyCode === 27) {
        event.preventDefault();
        this.props.activateSearch();
      }
    }, false);
  }

  activateSearch = () => {
    this.setState({searchActive: !this.state.searchActive});
  }

  render() {
    const {page, searchActive} = this.state;
    const {children} = this.props;
    return (
      <CanonComponent d3plus={d3plus} className={`${page} container`}>
        {searchActive ? <Search activateSearch={this.activateSearch} /> : null}
        <Navigation activateSearch={this.activateSearch} />
        { children }
        <Footer />
      </CanonComponent>
    );
  }


}

export default App;
