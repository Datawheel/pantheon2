import React, {Component} from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import "css/components/explore/explore";
import {RANKINGS_RESULTS_PER_PAGE} from "types";
import RankingPagination from "components/explore/rankings/RankingPagination";
import {sortRankingsTable, updateRankingsTable} from "actions/rankings";
import {getNewData} from "actions/explore";
import {COLUMNS} from "components/explore/rankings/RankingColumns";

class RankingTable extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {explore} = this.props;
    const {data, rankings, show} = explore;
    // console.log(show)
    // return (<div>rankingtable</div>)
    const {pages, page, loading, sorting} = rankings;
    // const {results, type, typeNesting, sorting} = this.props.rankings;
    // const {data} = this.props.explore;
    const {sortRankingsTable, getNewData} = this.props;
    const pageSize = RANKINGS_RESULTS_PER_PAGE;
    const showDepth = show.depth || show.type;

    let columns = COLUMNS[show.type][showDepth];
    const rankColumnRender = ({index}) => {
      const offset = page * RANKINGS_RESULTS_PER_PAGE;
      return <span>{index + 1 + offset}</span>;
    };
    columns[0].render = rankColumnRender;

    if (!loading) {
      columns = columns.map(c => {
        c.sort = null;
        delete c.sort;
        if (sorting) {
          if (c.id === sorting.id || c.accessor === sorting.id) {
            c.sort = "desc";
          }
        }
        else {
          if (c.accessor === "langs") {
            c.sort = "desc";
          }
        }
        return c;
      })
    }

    return (
      <div className="ranking-table-container">
        <RankingPagination />
        <ReactTable
          className="ranking-table -highlight"
          columns={columns}
          pageSize={pageSize}
          data={data}
          showPagination={false}
          pages={pages}
          loading={loading}
          onChange={getNewData}
          onSortingChange={sortRankingsTable}
        />
        <RankingPagination />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

const mapDispatchToProps = dispatch => ({
  sortRankingsTable: column => {
    dispatch(sortRankingsTable(column));
  },
  updateRankingsTable: () => {
    dispatch(updateRankingsTable());
  },
  getNewData: () => {
    dispatch((dispatch, getState) => getNewData(dispatch, getState));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingTable);
