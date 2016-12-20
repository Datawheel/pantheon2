import React, {Component} from "react";
import {connect} from "react-redux";
import {changePage} from "actions/rankings";

class RankingPagination extends Component {

  constructor(props) {
    super(props);
    this.changePage = this.props.changePage.bind(this);
  }

  render() {
    const {results} = this.props.rankings;
    const currentPage = results.page;
    const totalNumPages = results.pages;

    return (
      <div className="ranking-pagination">
        <a href="#" onClick={currentPage > 0 ? this.changePage : null}>Prev</a>
        <span>page {results.page + 1} of {results.pages}</span>
        <a href="#" onClick={currentPage < (totalNumPages - 1) ? this.changePage : null}>Next</a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps, {changePage})(RankingPagination);
