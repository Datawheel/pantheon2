import React, {Component} from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import {RANKINGS_RESULTS_PER_PAGE} from "types";
// import {updateRankingsTable} from "actions/rankings";
import {COLUMNS} from "pages/explore/rankings/RankingColumns";

import "pages/explore/Explore.css";
import "pages/explore/rankings/Rankings.css";

class RankingTableMin extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {results, type, typeNesting} = this.props.rankings;
    const {updateRankingsTable} = this.props;
    const pageSize = type === "profession" ? results.data.length : RANKINGS_RESULTS_PER_PAGE;

    let columns = COLUMNS[type][typeNesting];
    const rankColumnRender = ({index}) => {
      const offset = results.page * RANKINGS_RESULTS_PER_PAGE;
      return <span>{index+1+offset}</span>;
    };
    columns[0].render = rankColumnRender;

    return (
      <div className="control-group ranking-table-min">
        <ReactTable
          className="ranking-table"
          columns={columns}
          pageSize={pageSize}
          data={results.data}
          showPagination={false}
          loading={results.loading}
          onChange={updateRankingsTable}
        />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps, {updateRankingsTable})(RankingTableMin);
