import React, {Component, PropTypes} from "react";
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
  }

  getChildContext() {
    return {
      d3plus: this.props.d3plus || {}
    };
  }

  render() {
    const {children, searchActive, location} = this.props;
    return (
      <div className={ location.pathname === "/" ? "app home" : "app"}>
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
  d3plus: React.PropTypes.object
};

App.defaultProps = {d3plus};

App.propTypes = {
  children: PropTypes.object,
  d3plus: React.PropTypes.object,
  searchActive: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    searchActive: state.search.searchActive
  };
}

export default connect(mapStateToProps, {activateSearch})(App);
