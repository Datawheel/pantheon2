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

    // console.log("rankings data:", data);
    // const data2 = dataFormatter(res.data, show);
    // console.log("[RankingTable loading]", loading);
    // console.log("[RankingTable data]", data);

    return (
      <div className="ranking-table-container">
        <div className="ranking-head">
          <RankingResultsPerPage changePageSize={changePageSize} />
          <RankingSearch search={search} />
        </div>
        <ReactTable
          style={{width: "100%"}}
          className="-striped -highlight"
          loading={loading}
          data={data}
          columns={columns}
          defaultSorted={[
            {
              id: sortCol.accessor,
              desc: true
            }
          ]}
          defaultPageSize={50}
          page={page}
          pageSize={Math.min(pageSize, data.length)}
          showPageSizeOptions={false}
          onPageChange={onPageChange}
        />
      </div>
    );
  }
}

export default RankingTable;
