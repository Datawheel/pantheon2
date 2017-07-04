import React, {Component} from "react";
import {connect} from "react-redux";
import {changePage} from "actions/explore";
import {animateScroll} from "react-scroll";

class RankingPagination extends Component {

  constructor(props) {
    super(props);
    this.changePage = this.props.changePage.bind(this);
  }

  render() {
    const {rankings} = this.props;
    const currentPage = rankings.page;
    const totalNumPages = rankings.pages;

    return (
      <div className="ranking-result-count">
        <span>page {rankings.page + 1} of {rankings.pages}</span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rankings: state.explore.rankings
  };
}

const mapDispatchToProps = dispatch => ({
  changePage: e => {
    e.preventDefault();
    animateScroll.scrollToTop({duration: 500});
    const direction = e.target.innerText.toLowerCase() === "next" ? 1 : -1;
    dispatch(changePage(direction));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingPagination);
