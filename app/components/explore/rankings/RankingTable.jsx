import React, {Component} from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import styles from "css/components/explore/explore";
import {RANKINGS_RESULTS_PER_PAGE} from "types";
import RankingPagination from "components/explore/rankings/RankingPagination";
import {updateRankingsTable} from "actions/rankings";
import {COLUMNS} from "components/explore/rankings/RankingColumns";

class RankingTable extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {results, type, typeNesting} = this.props.rankings;
    const {updateRankingsTable} = this.props;
    const pageSize = type === "occupation" ? results.data.length : RANKINGS_RESULTS_PER_PAGE;

    const columns = COLUMNS[type][typeNesting];
    const rankColumnRender = ({index}) => {
      const offset = results.page * RANKINGS_RESULTS_PER_PAGE;
      return <span>{index + 1 + offset}</span>;
    };
    columns[0].render = rankColumnRender;

    return (
      <div className="ranking-table-container">
        <h1>Most Globally Remembered People</h1>
        <h3 className="ranking-table-date">4000 BC - 2013</h3>
        <RankingPagination />
        <ReactTable
          className="ranking-table"
          columns={columns}
          pageSize={pageSize}
          data={results.data}
          showPagination={false}
          pages={results.pages}
          loading={results.loading}
          onChange={updateRankingsTable}
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

export default connect(mapStateToProps, {updateRankingsTable})(RankingTable);
