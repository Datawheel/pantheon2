import React, {Component} from "react";
import {connect} from "react-redux";
import {changePage} from "actions/explore";
import {animateScroll} from "react-scroll";

class RankingPagination extends Component {

  constructor(props) {
    super(props);
  }

  changePage(e) {
    e.preventDefault();
    const direction = e.target.innerText.toLowerCase() === "next" ? 1 : -1;
    animateScroll.scrollToTop({duration: 500});
    this.props.changePage(direction);
  }

  render() {
    const {rankings} = this.props;
    const currentPage = rankings.page;
    const totalNumPages = rankings.pages;
    const changePage = this.changePage.bind(this);

    return (
      <div className="ranking-pagination">
        {currentPage > 0
          ? <a href="#" onClick={changePage}>Prev</a> : <span>Prev</span>}
        &nbsp;|&nbsp;
        {currentPage < totalNumPages - 1
          ? <a href="#" onClick={changePage}>Next</a> : <span>Next</span>}
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
  changePage: direction => {
    dispatch(changePage(direction));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingPagination);
