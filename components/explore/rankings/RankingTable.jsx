"use client";
import {useEffect, useMemo, useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {useSelector, useDispatch} from "react-redux";
import {useTable, usePagination, useSortBy} from "react-table";
import getColumns from "./RankingColumns";
import {fetchDataAndDispatch} from "../../../components/utils/exploreHelpers";
import {updateDataPageIndex} from "../../../features/exploreSlice";
import "./Rankings.css";

export default function RankingTable({places}) {
  const exploreState = useSelector(state => state.explore);
  const {data, dataCount, dataPageIndex, show} = exploreState;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const controlledPageCount =
    data && data.length ? Math.ceil(dataCount / 50) : 1;
  const controlledPageIndex = data && data.length ? dataPageIndex : 0;

  const [pageInputVal, setPageInputVal] = useState(controlledPageIndex);

  const columns = useMemo(
    () => getColumns(show.type, show.depth, controlledPageIndex * 50),
    // [controlledPageIndex]
    [controlledPageIndex, show.type]
  );

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
    setPageSize,
    // Get the state from the instance
    state: {pageIndex, pageSize, sortBy},
  } = useTable(
    {
      columns,
      data,
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
      useControlledState: state =>
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

  useEffect(() => {
    fetchDataAndDispatch(
      places,
      exploreState,
      dispatch,
      router,
      pathname,
      controlledPageIndex,
      sortBy
    );
  }, [sortBy]);

  useEffect(() => {
    setPageInputVal(controlledPageIndex);
  }, [controlledPageIndex]);

  console.log("pageIndex, pageSize, sortBy", pageIndex, pageSize, sortBy);

  const setPageAndFetchData = pageNum => {
    setPageInputVal(pageNum);
    dispatch(updateDataPageIndex(pageNum));
    fetchDataAndDispatch(
      places,
      exploreState,
      dispatch,
      router,
      pathname,
      pageNum,
      sortBy
    );
  };

  return (
    <div className="ranking-table-container">
      <div className="ranking-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr key={null} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
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
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
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
      <div className="pagination">
        <button
          onClick={() => setPageAndFetchData(0)}
          disabled={!canPreviousPage || data.loading}
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => setPageAndFetchData(controlledPageIndex - 1)}
          disabled={!canPreviousPage || data.loading}
        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => setPageAndFetchData(controlledPageIndex + 1)}
          disabled={!canNextPage || data.loading}
        >
          {">"}
        </button>{" "}
        <button
          onClick={() => setPageAndFetchData(pageCount - 1)}
          disabled={!canNextPage || data.loading}
        >
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
              setPageAndFetchData(page);
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
                setPageAndFetchData(page);
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
          {[10, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
