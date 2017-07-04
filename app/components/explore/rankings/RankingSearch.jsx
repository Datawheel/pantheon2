import React, {Component} from "react";
import {connect} from "react-redux";
import {changeSearch} from "actions/explore";

class RankingPagination extends Component {

  constructor(props) {
    super(props);
    // this.changeSearch = this.props.changeSearch.bind(this);
  }

  changeSearch = () => {
    const searchTerm = this.searchInput.value;
    this.props.changeSearch(searchTerm);
  }

  render() {
    const {searchTerm} = this.props.rankings;
    return (
      <div className="ranking-search">
        <input
          type="text"
          value={searchTerm}
          onKeyPress={e => {(e.key === "Enter" ? this.changeSearch() : null)}}
          ref={input => { this.searchInput = input; }} />
        <button onClick={this.changeSearch}>Search</button>
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
  changeSearch: searchTerm => {
    console.log(searchTerm)
    dispatch(changeSearch(searchTerm));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingPagination);
