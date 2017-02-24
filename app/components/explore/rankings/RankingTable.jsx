import React, {Component} from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import styles from "css/components/explore/explore";
import {RANKINGS_RESULTS_PER_PAGE} from "types";
import RankingPagination from "components/explore/rankings/RankingPagination";
import {sortRankingsTable, updateRankingsTable} from "actions/rankings";
import {COLUMNS} from "components/explore/rankings/RankingColumns";

class RankingTable extends Component {

  constructor(props) {
    super(props);
  }

  render() { 
    const {results, type, typeNesting, sorting} = this.props.rankings;
    const {sortRankingsTable, updateRankingsTable} = this.props;
    const pageSize = type === "occupation" ? results.data.length : RANKINGS_RESULTS_PER_PAGE;

    let columns = COLUMNS[type][typeNesting];
    const rankColumnRender = ({index}) => {
      const offset = results.page * RANKINGS_RESULTS_PER_PAGE;
      return <span>{index + 1 + offset}</span>;
    };
    columns[0].render = rankColumnRender;

    if (!results.loading) {
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
        <h1>Most Globally Remembered People</h1>
        <h3 className="ranking-table-date">4000 BC - 2013</h3>
        <RankingPagination />
        <ReactTable
          className="ranking-table -highlight"
          columns={columns}
          pageSize={pageSize}
          data={results.data}
          showPagination={false}
          pages={results.pages}
          loading={results.loading}
          onChange={updateRankingsTable}
          onSortingChange={sortRankingsTable}
        />
        <RankingPagination />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

const mapDispatchToProps = dispatch => ({
  sortRankingsTable: column => {
    dispatch(sortRankingsTable(column));
  },
  updateRankingsTable: () => {
    dispatch(updateRankingsTable());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingTable);
