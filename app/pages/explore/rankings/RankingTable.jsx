/* eslint-disable react/display-name */
import React, {useEffect, useLayoutEffect, useRef} from "react";
import {connect} from "react-redux";
import {useTable, usePagination, useSortBy} from "react-table";
import PersonImage from "components/utils/PersonImage";

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


const RankingTable = ({countryLookup, changePageSize, data, fetchData, occupations, onPageChange, page: myPage, pageSize: myPageSize, places, resetNewData, search, show}) => {
  // console.log("myPageSize!!", myPageSize);
  // console.log("myPage!!", myPage);
  // console.log("data!", data);
  // return <div>table here</div>;
  const showDepth = show;
  // const columns = getColumns(show, showDepth, occupations, places);
  // const sortCol = columns.find(c => c.defaultSorted);
  const controlledPageCount = data.data && data.data.length ? Math.ceil(data.count / 50) : 1;
  const controlledPageIndex = data.data && data.data.length ? data.pageIndex : 0;

  const columns = React.useMemo(
    () => [
      {
        Header: "Info",
        columns: [
          {
            disableSortBy: true,
            Header: "#",
            id: "row",
            accessor: (_d, i) => i + 1 + controlledPageIndex * 50,
            maxWidth: 45
          },
          {
            disableSortBy: true,
            Header: "",
            accessor: "id",
            Cell: ({value}) => <PersonImage className="ranking-thumbnail" src={`/images/profile/people/${value}.jpg`} fallbackSrc="/images/icons/icon-person.svg" />,
            maxWidth: 70
          },
          {
            Header: "Name",
            accessor: "name",
            style: {whiteSpace: "unset"},
            Cell: ({value, row: {original}}) => <a href={`/profile/person/${original.slug}`}>{value}</a>
          },
          {
            id: "occupation_id",
            Header: "Occupation",
            accessor: d => d.occupation ? d.occupation.occupation : null,
            Cell: ({value, row: {original}}) => value ? <a href={`/profile/occupation/${original.occupation.occupation_slug}`}>{value}</a> : <span>-</span>
          },
          {
            Header: "Birth",
            accessor: "birthyear",
            Cell: ({value}) => value ? <span>{FORMATTERS.year(value)}</span> : <span>{"Unknown"}</span>,
            minWidth: 50
          },
          {
            Header: "Death",
            accessor: "deathyear",
            Cell: ({value}) => value ? <span>{FORMATTERS.year(value)}</span> : <span>{"-"}</span>,
            minWidth: 45
          },
          {
            Header: "Gender",
            accessor: "gender",
            Cell: ({value}) => <span>{value === "M" ? "Male" : value === "F" ? "Female" : "-"}</span>,
            minWidth: 65,
            sortMethod: (a, b) => {
              const aIndex = genderOrder.indexOf(a);
              const bIndex = genderOrder.indexOf(b);
              return bIndex < aIndex ? -1 : bIndex > aIndex ? 1 : 0;
            }
          }
        ]
      },
      {
        Header: "Birthplace",
        columns: [
          {
            id: "bplace_geonameid",
            Header: "City",
            style: {whiteSpace: "unset"},
            accessor: d => d.bplace_geonameid ? d.bplace_geonameid.place : null,
            Cell: ({value, row: {original}}) => value ? <a href={`/profile/place/${original.bplace_geonameid.slug}`}>{value}</a> : <span>-</span>
          },
          {
            id: "bplace_country",
            Header: "Country",
            style: {whiteSpace: "unset"},
            accessor: d => d.bplace_country ? d.bplace_country.country : null,
            Cell: ({value, row: {original}}) => value ? <a href={`/profile/country/${original.bplace_country.slug}`}>{value}</a> : <span>-</span>
          }
        ]
      },
      {
        Header: "Deathplace",
        columns: [
          {
            id: "dplace_geonameid",
            Header: "City",
            style: {whiteSpace: "unset"},
            accessor: d => d.dplace_geonameid ? d.dplace_geonameid.place : null,
            Cell: ({value, row: {original}}) => value ? <a href={`/profile/place/${original.dplace_geonameid.slug}`}>{value}</a> : <span>-</span>
          },
          {
            id: "dplace_country",
            Header: "Country",
            style: {whiteSpace: "unset"},
            accessor: d => d.dplace_country ? d.dplace_country.country : null,
            Cell: ({value, row: {original}}) => value ? <a href={`/profile/country/${original.dplace_country.slug}`}>{value}</a> : <span>-</span>
          }
        ]
      },
      {
        Header: "Stats",
        columns: [
          {
            Header: () => <Tooltip className="table-tooltip-trigger" content={"Wikipedia language editions"}>
              <div>L <Icon icon="info-sign" iconSize={10} /></div>
            </Tooltip>,
            accessor: "l",
            minWidth: 105,
            className: "cell_numeric",
            headerClassName: "nowrap",
            sortDescFirst: true
          },
          {
            Header: () => <Tooltip className="table-tooltip-trigger" content={"Effective Wikipedia language editions"}>
              <div>L* <Icon icon="info-sign" iconSize={10} /></div>
            </Tooltip>,
            accessor: "l_",
            Cell: ({value}) => FORMATTERS.decimal(value),
            minWidth: 105,
            className: "cell_numeric",
            headerClassName: "nowrap",
            sortDescFirst: true
          },
          {
            Header: () => <Tooltip className="table-tooltip-trigger" content={"Non-english Wikipedia pageviews in the past 6 months"}>
              <div>PVne <Icon icon="info-sign" iconSize={10} /></div>
            </Tooltip>,
            accessor: "non_en_page_views",
            Cell: ({value}) => FORMATTERS.bigNum(value),
            width: 105,
            headerClassName: "nowrap",
            sortDescFirst: true
          },
          {
            Header: () => <Tooltip className="table-tooltip-trigger" content={"Coefficient of variation in Wikipedia Pageviews: to discount characters that have short periods of popularity"}>
              <div>CV <Icon icon="info-sign" iconSize={10} /></div>
            </Tooltip>,
            accessor: "coefficient_of_variation",
            Cell: ({value}) => FORMATTERS.decimal(value),
            minWidth: 105,
            className: "cell_numeric",
            headerClassName: "nowrap",
            sortDescFirst: true
          },
          {
            Header: () => <Tooltip className="table-tooltip-trigger" content={"Historical Popularity Index"}>
              <div>HPI 2020 <Icon icon="info-sign" iconSize={10} /></div>
            </Tooltip>,
            accessor: "hpi",
            Cell: ({value}) => FORMATTERS.decimal(value),
            defaultSorted: true,
            minWidth: 105,
            className: "cell_numeric",
            sortDescFirst: true
          },
          {
            Header: () => <Tooltip className="table-tooltip-trigger" content={"Historical Popularity Index"}>
              <div>HPI 2019 <Icon icon="info-sign" iconSize={10} /></div>
            </Tooltip>,
            accessor: "hpi_prev",
            Cell: ({value}) => value ? FORMATTERS.decimal(value) : "-",
            defaultSorted: true,
            minWidth: 105,
            className: "cell_numeric",
            sortDescFirst: true
          }
        ]
      },
      {
        Header: "Occupation Ranking",
        columns: [
          {
            Header: "2020",
            accessor: "occupation_rank",
            minWidth: 45,
            className: "cell_numeric"
          },
          {
            Header: "2019",
            accessor: "occupation_rank_prev",
            minWidth: 45,
            className: "cell_numeric"
          },
          {
            Header: "∆",
            accessor: "occupation_rank_delta",
            minWidth: 45,
            className: "cell_numeric",
            Cell: ({value}) => value ? value > 0 ? <span className="u-positive-text u-positive-arrow">{`+${value}`}</span> : <span className="u-negative-text u-negative-arrow">{value}</span> : "-"
          }
        ]
      },
      {
        Header: "Birth Country Ranking",
        columns: [
          {
            Header: "2020",
            accessor: "bplace_country_rank",
            minWidth: 45,
            className: "cell_numeric"
          },
          {
            Header: "2019",
            accessor: "bplace_country_rank_prev",
            minWidth: 45,
            className: "cell_numeric"
          },
          {
            Header: "∆",
            accessor: "bplace_country_rank_delta",
            minWidth: 85,
            className: "cell_numeric",
            Cell: ({value}) => value ? value > 0 ? <span className="u-positive-text u-positive-arrow">{`+${value}`}</span> : <span className="u-negative-text u-negative-arrow">{value}</span> : "-"
          }
        ]
      }
    ],
    [controlledPageIndex]
  );

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
      initialState: {pageIndex: 0, pageSize: 50, sortBy: []}, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      manualSortBy: true,
      pageCount: controlledPageCount,
      useControlledState: state => {
        const f = "tset";
        //         console.log(`\n\n---------------------------------
        // INSIDE CONTROL (data.new changed!)
        // ---------------------------------`);
        //         console.log("data.new?", data.new);
        //         console.log(state);
        //         console.log(`---------------------------------
        // END INSIDE CONTROL
        // ---------------------------------\n`);
        // console.log(`\n\nINSIDE CONTROL: ${state.pageIndex} || data.pageIndex: ${data.pageIndex} || controlledPageIndex: ${controlledPageIndex} || data.new: ${data.new}\n\n`);
        // return {...state, pageIndex: data.new ? data.pageIndex : state.pageIndex};
        return React.useMemo(
          () => {
            let newState = {
              ...state,
              pageIndex: state.pageIndex
            };
            if (data.new) {
              newState = {...state, pageIndex: data.pageIndex};
            }
            return newState;
          },
          [state, data.new]
        );
      }
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

    console.log("componentDidUpdateFunction");
  });

  // Listen for changes in pagination and use the state to fetch our new data
  // console.log("[pageIndex, pageSize, sortBy]", [pageIndex, pageSize, sortBy]);
  console.log("firstUpdate?", firstUpdate);
  useEffect(() => {
    console.log("\n\n!!!!!useEffect!!\n\n");
    if (!data.new && !firstUpdate.current) {
      // console.log("------- fetching new data --------");
      const newData = false;
      fetchData(pageIndex, pageSize, newData, sortBy);
    }
    else {
      // console.log("!!!!!!!!! NOT fetching new data !!!!!!!!!");
      resetNewData();
    }
    // console.log("fetch data here!, pageIndex, pageSize:", pageIndex, pageSize);
    // console.log("sortBy:", sortBy);
    // fetchPantheonData("rankings", countryLookup);
  // }, [fetchData, pageIndex, pageSize]);
  }, [pageIndex, pageSize, sortBy]);

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
        <RankingResultsPerPage changePageSize={changePageSize} />
        <RankingSearch search={search} />
      </div>
      <div className="ranking-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup =>
            // console.log(headerGroup.getHeaderGroupProps());
              <tr {...headerGroup.getHeaderGroupProps()}>
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
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
            onKeyDown={e => {
              if (e.key === "Enter") {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }
            }}
            style={{width: "100px"}}
            value={pageIndex + 1}
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
  data: state.vb.data
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingTable);
