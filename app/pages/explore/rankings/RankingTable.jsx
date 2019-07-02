import React, {Component} from "react";
import ReactTable from "react-table";
import getColumns from "pages/explore/rankings/RankingColumns";
import RankingSearch from "pages/explore/rankings/RankingSearch";
import RankingResultsPerPage from "pages/explore/rankings/RankingResultsPerPage";
import "pages/explore/rankings/Rankings.css";
import "react-table/react-table.css";

class RankingTable extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {changePageSize, data, loading, occupations, onPageChange, page, pageSize, places, search, show} = this.props;
    const showDepth = show;
    const columns = getColumns(show, showDepth, occupations, places);
    const sortCol = columns.find(c => c.defaultSorted);

    return (
      <div className="ranking-table-container">
        <div className="ranking-head">
          <RankingResultsPerPage changePageSize={changePageSize} />
          <RankingSearch search={search} />
        </div>
        <ReactTable
          className="-striped -highlight"
          columns={columns}
          defaultPageSize={50}
          defaultSorted={[
            {
              id: sortCol.accessor,
              desc: true
            }
          ]}
          data={data}
          loading={loading}
          onPageChange={onPageChange}
          page={page}
          pageSize={Math.min(pageSize, data.length)}
          resizable={false}
          showPageSizeOptions={false}
          style={{width: "100%"}}
        />
      </div>
    );
  }
}

export default RankingTable;
