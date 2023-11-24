"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTable, usePagination, useSortBy } from "react-table";
import getColumns from "./RankingColumns";
import "./Rankings.css";

export default function RankingTable({}) {
  const {
    data,
    city,
    country,
    gender,
    occupation,
    placeType,
    show,
    viz,
    yearType,
  } = useSelector((state) => state.explore);
  const controlledPageCount = 1;
  const controlledPageIndex = 0;
  // const controlledPageCount = data.data && data.data.length ? Math.ceil(data.count / 50) : 1;
  // const controlledPageIndex =
  //   data && data.length ? data.pageIndex : 0;

  const columns = useMemo(
    () => getColumns(show.type, show.depth, controlledPageIndex * 50),
    // [controlledPageIndex]
    [controlledPageIndex, show.type]
  );
  console.log("columns", columns);
  console.log("data", data);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page = 0,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data: data,
      initialState: {
        pageIndex: 0,
        pageSize: 50,
        sortBy: [
          {
            id: "hpi",
            desc: true,
          },
        ],
      }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      manualSortBy: true,
      pageCount: controlledPageCount,
      useControlledState: (state) =>
        useMemo(
          () => ({
            ...state,
            pageIndex: controlledPageIndex,
          }),
          [state, controlledPageIndex]
        ),
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="ranking-table-container">
      <div className="ranking-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={null} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const headerClassName = column.isSorted
                    ? column.isSortedDesc
                      ? `${column.headerClassName} col-sort-desc`
                      : `${column.headerClassName} col-sort-asc`
                    : column.headerClassName
                    ? `${column.headerClassName}`
                    : "";

                  return (
                    <th
                      {...column.getHeaderProps(
                        column.getSortByToggleProps({
                          className: headerClassName,
                        })
                      )}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: cell.column.style,
                        },
                      ])}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              {data.loading ? (
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                  results
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
