import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {activateSearch} from "actions/nav";
import Navigation from "containers/Navigation";
import Footer from "containers/Footer";
import Search from "components/Search";
import d3plus from "viz/d3plus";
import "css/main";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {page: undefined};
  }

  getChildContext() {
    return {
      d3plus: this.props.d3plus || {}
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

  render() {
    const {children, searchActive} = this.props;

    return (
      <div className={this.state.page}>
        { searchActive ? <Search /> : null }
        <Navigation />
        {children}
        <Footer />
      </div>
    );
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
}

App.childContextTypes = {
  d3plus: PropTypes.object
};

App.defaultProps = {d3plus};

App.propTypes = {
  children: PropTypes.object,
  d3plus: PropTypes.object,
  searchActive: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    searchActive: state.search.searchActive
  };
}

export default connect(mapStateToProps, {activateSearch})(App);
