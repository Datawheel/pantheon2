import React, {Component} from "react";
import Navigation from "components/Navigation";
import Footer from "components/Footer";
import {CanonComponent} from "datawheel-canon";
import d3plus from "viz/d3plus";
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {page: undefined};
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

  render() {
    const {page} = this.state;
    const {children, searchActive} = this.props;
    return (
      <CanonComponent d3plus={d3plus} className={`${page} container`}>
        <Navigation />
        { children }
        <Footer />
      </CanonComponent>
    );
  }


}

export default App;
