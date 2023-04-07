/* eslint-disable react/display-name */
import React, {useEffect, useLayoutEffect, useRef} from "react";
import {connect} from "react-redux";
import {useTable, usePagination, useSortBy} from "react-table";

import getColumns from "pages/explore/rankings/RankingColumns";
import RankingSearch from "pages/explore/rankings/RankingSearch";
import RankingResultsPerPage from "pages/explore/rankings/RankingResultsPerPage";
import fetchPantheonData from "pages/explore/helpers/fetchPantheonData";
import {fetchData, resetNewData} from "actions/vb";
import "pages/explore/rankings/Rankings.css";
// import "react-table/react-table.css";
import {FORMATTERS} from "types";
import {Icon, Tooltip} from "@blueprintjs/core";
const genderOrder = ["M", null, "F"];

const RankingTable = ({data, fetchData, show}) => {
  // console.log("myPageSize!!", myPageSize);
  // console.log("myPage!!", myPage);
  // console.log("data!", data);
  // return <div>table here</div>;
  // const sortCol = columns.find(c => c.defaultSorted);
  const controlledPageCount = data.data && data.data.length ? Math.ceil(data.count / 50) : 1;
  const controlledPageIndex = data.data && data.data.length ? data.pageIndex : 0;

  const [pageInputVal, setPageInputVal] = React.useState(controlledPageIndex);

  const columns = React.useMemo(
    () => getColumns(show.type, show.depth, controlledPageIndex * 50),
    // [controlledPageIndex]
    [controlledPageIndex, show.type]
  );

  // console.log("!!!showColumns!!!", showColumns);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: {pageIndex, pageSize, sortBy}
  } = useTable(
    {
      columns,
      data: data.data,
      initialState: {pageIndex: 0, pageSize: 50, sortBy: [{
        id: "hpi",
        desc: true
      }]}, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      manualSortBy: true,
      pageCount: controlledPageCount,
      useControlledState: state =>
        //         console.log(`\n\n---------------------------------
        // INSIDE CONTROL (data.new changed!)
        // ---------------------------------`);
        //         console.log("data.new?", data.new);
        //         console.log(state);
        //         console.log(`---------------------------------
        // END INSIDE CONTROL
        // ---------------------------------\n`);
        // console.log(`\n\nINSIDE CONTROL: ${state.pageIndex} || data.pageIndex: ${data.pageIndex} || controlledPageIndex: ${controlledPageIndex} || data.new: ${data.new}\n\n`);
        // console.log(`\n\nINSIDE CONTROL: ${state.pageIndex} || data.pageIndex: ${data.pageIndex} || controlledPageIndex: ${controlledPageIndex} || data.new: ${data.new}\n\n`);
        // return {...state, pageIndex: data.new ? data.pageIndex : state.pageIndex};
      //   return React.useMemo(
      //     () => {
      //       let newState = {
      //         ...state,
      //         pageIndex: state.pageIndex
      //       };
      //       if (data.new) {
      //         newState = {...state, pageIndex: data.pageIndex};
      //       }
      //       return newState;
      //     },
      //     [state, data.new]
      //   );
        React.useMemo(
          () => ({
            ...state,
            pageIndex: controlledPageIndex
          }),
          [state, controlledPageIndex]
        )

    },
    useSortBy,
    usePagination
  );
  // console.log(`pageIndex: ${pageIndex} :: data.pageIndex: ${data.pageIndex}`);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  });

  // Listen for changes in pagination and use the state to fetch our new data
  // console.log("[pageIndex, pageSize, sortBy]", [pageIndex, pageSize, sortBy]);
  useEffect(() => {
    console.log("------- fetching new data --------");
    const newData = false;
    fetchData(pageIndex, pageSize, newData, sortBy);
    // if (!data.new && !firstUpdate.current) {
    //   console.log("------- fetching new data --------");
    //   const newData = false;
    //   fetchData(pageIndex, pageSize, newData, sortBy);
    // }
    // else {
    //   // console.log("!!!!!!!!! NOT fetching new data !!!!!!!!!");
    //   resetNewData();
    // }

    // console.log("fetch data here!, pageIndex, pageSize:", pageIndex, pageSize);
    // console.log("sortBy:", sortBy);
    // fetchPantheonData("rankings", countryLookup);
  // }, [fetchData, pageIndex, pageSize]);
  // }, [pageIndex, pageSize, sortBy]);
  }, [sortBy]);

  useEffect(() => {
    setPageInputVal(controlledPageIndex);
  }, [controlledPageIndex]);

  // <ReactTable
  //       className="-striped -highlight"
  //       columns={columns}
  //       defaultPageSize={50}
  //       defaultSorted={[
  //         {
  //           id: sortCol.accessor,
  //           desc: true
  //         }
  //       ]}
  //       data={data}
  //       loading={loading}
  //       onPageChange={onPageChange}
  //       page={page}
  //       pageSize={Math.min(pageSize, data.length)}
  //       resizable={false}
  //       showPageSizeOptions={false}
  //       style={{width: "100%"}}
  //     />
  // console.log("getTableProps!!!", getTableProps());


  return (
    <div className="ranking-table-container">
      <div className="ranking-head">
        {/* <RankingResultsPerPage changePageSize={changePageSize} />
        <RankingSearch search={search} /> */}
      </div>
      <div className="ranking-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup =>
            // console.log(headerGroup.getHeaderGroupProps());
              <tr key={null} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const headerClassName = column.isSorted
                    ? column.isSortedDesc
                      ? `${column.headerClassName} col-sort-desc`
                      : `${column.headerClassName} col-sort-asc`
                    : column.headerClassName ? `${column.headerClassName}` : "";
                  // <th {...column.getHeaderProps()}>
                  return <th {...column.getHeaderProps(column.getSortByToggleProps({className: headerClassName}))}>
                    {column.render("Header")}
                  </th>;
                }
                )}
              </tr>

            )}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {/* {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render("Cell")}</td>)} */}
                  {row.cells.map(cell =>
                    <td
                    // Return an array of prop objects and react-table will merge them appropriately
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: cell.column.style
                        }
                      ])}
                    >
                      {cell.render("Cell")}
                    </td>
                  )}
                </tr>
              );
            })}
            <tr>
              {data.loading
              // Use our custom loading state to show a loading indicator
                ? <td colSpan="10000">Loading...</td>
                :               <td colSpan="10000">
                Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                results
                </td>
              }
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => (setPageInputVal(0), fetchData(0, 50, false, sortBy))} disabled={!canPreviousPage || data.loading}>
          {"<<"}
        </button>{" "}
        <button onClick={() => (setPageInputVal(controlledPageIndex - 1), fetchData(controlledPageIndex - 1, 50, false, sortBy))} disabled={!canPreviousPage || data.loading}>
          {"<"}
        </button>{" "}
        <button onClick={() => (setPageInputVal(controlledPageIndex + 1), fetchData(controlledPageIndex + 1, 50, false, sortBy))} disabled={!canNextPage || data.loading}>
          {">"}
        </button>{" "}
        <button onClick={() => (setPageInputVal(pageCount - 1), fetchData(pageCount - 1, 50, false, sortBy))} disabled={!canNextPage || data.loading}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            // defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageInputVal(page);
            }}
            onKeyDown={e => {
              let page = e.target.value ? Number(e.target.value) - 1 : 0;
              if (e.key === "Enter") {
                if (page > pageCount - 1) {
                  page = pageCount - 1;
                }
                if (page < 0) {
                  page = 0;
                }
                fetchData(page, 50, false, sortBy);
                setPageInputVal(page);
              }
            }}
            style={{width: "100px"}}
            value={pageInputVal + 1}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 50].map(pageSize =>
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          )}
        </select>
      </div>
    </div>
  );
};

const mapDispatchToProps = {fetchData, resetNewData};

const mapStateToProps = state => ({
  data: state.vb.data,
  show: state.vb.show
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingTable);
