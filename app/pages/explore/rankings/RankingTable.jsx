import React, {Component} from "react";
import ReactTable from "react-table";
import getColumns from "pages/explore/rankings/RankingColumns";
import "pages/explore/Explore.css";
import "react-table/react-table.css";

class RankingTable extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, loading, occupations, places, show} = this.props;
    const showDepth = show;
    const columns = getColumns(show, showDepth, occupations, places);
    const sortCol = columns.find(c => c.defaultSorted);

    return (
      <div className="ranking-table-container">
        <div className="ranking-head">
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
