"use client";
import {useEffect, useMemo, useState, useRef, useCallback} from "react";
import {useRouter, usePathname} from "next/navigation";
import {useSelector, useDispatch} from "react-redux";
import {useTable, usePagination, useSortBy} from "react-table";
import getColumns from "./RankingColumns";
import {fetchDataAndDispatch} from "../../../components/utils/exploreHelpers";
import {updateDataPageIndex, updateNameSearch} from "../../../features/exploreSlice";
import "./Rankings.css";

export default function RankingTable({baseApi, places}) {
  const exploreState = useSelector(state => state.explore);
  const {
    data,
    dataCount,
    dataLoading,
    dataPageIndex,
    show,
    birthMonth,
    birthDay,
    nameSearch,
  } = exploreState;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const controlledPageCount =
    data && data.length ? Math.ceil(dataCount / 50) : 1;
  const controlledPageIndex = data && data.length ? dataPageIndex : 0;

  const [pageInputVal, setPageInputVal] = useState(controlledPageIndex);
  const [searchInputVal, setSearchInputVal] = useState(nameSearch || "");
  const debounceRef = useRef(null);
  const hasMountedSortEffect = useRef(false);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchInputVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(updateNameSearch(val));
    }, 400);
  }, [dispatch]);

  const handleSearchClear = useCallback(() => {
    setSearchInputVal("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    dispatch(updateNameSearch(""));
  }, [dispatch]);

  const hasBirthdayFilter = birthMonth !== null || birthDay !== null;
  const hasNameSearch = nameSearch && nameSearch.trim().length >= 2;
  const columns = useMemo(
    () => getColumns(show.type, show.depth, controlledPageIndex * 50, {hasBirthdayFilter, nameSearch: hasNameSearch}),
    [controlledPageIndex, show.type, show.depth, hasBirthdayFilter, hasNameSearch]
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
          [state]
        ),
    },
    useSortBy,
    usePagination
  );

  const sortSignature = JSON.stringify(sortBy);

  useEffect(() => {
    if (!hasMountedSortEffect.current) {
      hasMountedSortEffect.current = true;
      return;
    }
    fetchDataAndDispatch(
      baseApi,
      places,
      exploreState,
      dispatch,
      router,
      pathname,
      controlledPageIndex,
      sortBy
    );
    // Sorting changes should refetch once with the current filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseApi,
    places,
    dispatch,
    router,
    pathname,
    sortSignature,
  ]);

  useEffect(() => {
    setPageInputVal(controlledPageIndex);
  }, [controlledPageIndex]);

  // console.log("pageIndex, pageSize, sortBy", pageIndex, pageSize, sortBy);

  const setPageAndFetchData = pageNum => {
    setPageInputVal(pageNum);
    dispatch(updateDataPageIndex(pageNum));
    fetchDataAndDispatch(
      baseApi,
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
        <div className="ranking-search-bar">
          <input
            type="text"
            className="ranking-search-input"
            placeholder="Search by name..."
            value={searchInputVal}
            onChange={handleSearchChange}
          />
          {searchInputVal && (
            <button
              className="ranking-search-clear"
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => {
              const {key: headerGroupKey, ...headerGroupProps} =
                headerGroup.getHeaderGroupProps();

              return (
                <tr key={headerGroupKey} {...headerGroupProps}>
                  {headerGroup.headers.map(column => {
                    const headerClassName = column.isSorted
                      ? column.isSortedDesc
                        ? `${column.headerClassName} col-sort-desc`
                        : `${column.headerClassName} col-sort-asc`
                      : column.headerClassName
                      ? `${column.headerClassName}`
                      : "";
                    const {key: headerKey, ...headerProps} = column.getHeaderProps(
                      column.getSortByToggleProps({
                        className: headerClassName,
                      })
                    );

                    return (
                      <th key={headerKey} {...headerProps}>
                        {column.render("Header")}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {dataLoading
              ? (
                <tr>
                  <td colSpan="10000">Loading...</td>
                </tr>
              )
              : (
                <>
                  {page.map(row => {
                    prepareRow(row);
                    const {key: rowKey, ...rowProps} = row.getRowProps();
                    return (
                      <tr key={rowKey} {...rowProps}>
                        {row.cells.map(cell => {
                          const {key: cellKey, ...cellProps} = cell.getCellProps([
                            {
                              className: cell.column.className,
                              style: cell.column.style,
                            },
                          ]);

                          return (
                            <td key={cellKey} {...cellProps}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="10000">
                      Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                      results
                    </td>
                  </tr>
                </>
              )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setPageAndFetchData(0)}
          disabled={!canPreviousPage || dataLoading}
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => setPageAndFetchData(controlledPageIndex - 1)}
          disabled={!canPreviousPage || dataLoading}
        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => setPageAndFetchData(controlledPageIndex + 1)}
          disabled={!canNextPage || dataLoading}
        >
          {">"}
        </button>{" "}
        <button
          onClick={() => setPageAndFetchData(pageCount - 1)}
          disabled={!canNextPage || dataLoading}
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
              setPageInputVal(page);
              // if (pageInputVal + 1 !== page) {
              //   setPageAndFetchData(page);
              // }
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
            onBlur={e => {
              let page = e.target.value ? Number(e.target.value) - 1 : 0;

              if (page > pageCount - 1) {
                page = pageCount - 1;
              }
              if (page < 0) {
                page = 0;
              }
              setPageAndFetchData(page);
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
