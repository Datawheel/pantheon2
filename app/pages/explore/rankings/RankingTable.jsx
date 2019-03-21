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

    // return <div>table ehre...</div>;

    // const data2 = dataFormatter(res.data, show);

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
  // render() {
  //   const {explore} = this.props;
  //   const {data, rankings, show} = explore;
  //   // console.log(show)
  //   // return (<div>rankingtable</div>)
  //   const {pages, page, loading, sorting} = rankings;
  //   // const {results, type, typeNesting, sorting} = this.props.rankings;
  //   // const {data} = this.props.explore;
  //   const {sortRankingsTable, getNewData} = this.props;
  //   const pageSize = RANKINGS_RESULTS_PER_PAGE;
  //   const showDepth = show.depth || show.type;
  //
  //   let columns = COLUMNS[show.type][showDepth];
  //   const rankColumnRender = ({index}) => {
  //     const offset = page * RANKINGS_RESULTS_PER_PAGE;
  //     return <span>{index + 1 + offset}</span>;
  //   };
  //   columns[0].render = rankColumnRender;
  //
  //   if (!loading) {
  //     columns = columns.map(c => {
  //       c.sort = null;
  //       delete c.sort;
  //       if (sorting) {
  //         if (c.id === sorting.id || c.accessor === sorting.id) {
  //           c.sort = "desc";
  //         }
  //       }
  //       else {
  //         if (c.accessor === "langs") {
  //           c.sort = "desc";
  //         }
  //       }
  //       return c;
  //     });
  //   }
  //
  //   return (
  //     <div className="ranking-table-container">
  //       <div className="ranking-head">
  //         <RankingPagination />
  //         <RankingResultCount />
  //         <RankingSearch />
  //       </div>
  //       <ReactTable
  //         className="ranking-table -highlight"
  //         columns={columns}
  //         pageSize={pageSize}
  //         data={data.data}
  //         showPagination={false}
  //         pages={pages}
  //         loading={loading}
  //         onChange={getNewData}
  //         onSortingChange={sortRankingsTable}
  //       />
  //       <RankingPagination />
  //     </div>
  //   );
  // }
}

export default RankingTable;
