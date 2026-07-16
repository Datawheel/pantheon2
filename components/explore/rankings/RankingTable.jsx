"use client";
import {useEffect, useMemo, useState, useRef, useCallback} from "react";
import {useRouter, usePathname} from "next/navigation";
import {useSelector, useDispatch} from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import getColumns from "./RankingColumns";
import {fetchDataAndDispatch} from "../../../components/utils/exploreHelpers";
import {
  updateDataPageIndex,
  updateNameSearch,
  updateSorting,
} from "../../../features/exploreSlice";
import "./Rankings.css";
import {
  formatExploreNumber,
  getExploreTranslations,
} from "@/app/exploreTranslations";

export default function RankingTable({baseApi, places, locale}) {
  const t = getExploreTranslations(locale);
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
    sorting,
  } = exploreState;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const pageSize = 50;
  const controlledPageCount =
    data && data.length ? Math.ceil(dataCount / pageSize) : 1;
  const controlledPageIndex = data && data.length ? dataPageIndex : 0;

  const [pageInputVal, setPageInputVal] = useState(controlledPageIndex);
  const [searchInputVal, setSearchInputVal] = useState(nameSearch || "");
  const debounceRef = useRef(null);

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
    () => getColumns(
      show.type,
      show.depth,
      controlledPageIndex * pageSize,
      {hasBirthdayFilter, nameSearch: hasNameSearch},
      locale,
    ),
    [controlledPageIndex, show.type, show.depth, hasBirthdayFilter, hasNameSearch, locale]
  );

  const handleSortingChange = useCallback((updater) => {
    const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
    dispatch(updateSorting(nextSorting));
  }, [dispatch, sorting]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: controlledPageCount,
    state: {
      sorting,
      pagination: {
        pageIndex: controlledPageIndex,
        pageSize,
      },
    },
    onSortingChange: handleSortingChange,
  });

  const canPreviousPage = controlledPageIndex > 0;
  const canNextPage = controlledPageIndex < controlledPageCount - 1;
  const pageCount = controlledPageCount;

  useEffect(() => {
    setPageInputVal(controlledPageIndex);
  }, [controlledPageIndex]);

  useEffect(() => {
    setSearchInputVal(nameSearch || "");
  }, [nameSearch]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

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
      sorting,
      true,
      locale,
    );
  };

  return (
    <div className="ranking-table-container">
      <div className="ranking-table">
        <div className="ranking-search-bar">
          <input
            type="text"
            className="ranking-search-input"
            placeholder={t("searchByName")}
            value={searchInputVal}
            onChange={handleSearchChange}
          />
          {searchInputVal && (
            <button
              className="ranking-search-clear"
              onClick={handleSearchClear}
              aria-label={t("clearSearch")}
            >
              &times;
            </button>
          )}
        </div>
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const sortDir = header.column.getIsSorted();
                  const headerClassName = [
                    header.column.columnDef.headerClassName,
                    sortDir === "desc" ? "col-sort-desc" : sortDir === "asc" ? "col-sort-asc" : "",
                  ].filter(Boolean).join(" ");

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={headerClassName || undefined}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{cursor: header.column.getCanSort() ? "pointer" : "default"}}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {dataLoading
              ? (
                <tr>
                  <td colSpan={999}>{t("loading")}</td>
                </tr>
              )
              : (
                <>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className={cell.column.columnDef.className || undefined}
                          style={cell.column.columnDef.style || undefined}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={999}>
                      {t("showingResults", {
                        shown: formatExploreNumber(table.getRowModel().rows.length, locale),
                        total: formatExploreNumber(controlledPageCount * pageSize, locale),
                      })}
                    </td>
                  </tr>
                </>
              )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          aria-label={t("firstPage")}
          onClick={() => setPageAndFetchData(0)}
          disabled={!canPreviousPage || dataLoading}
        >
          {"<<"}
        </button>{" "}
        <button
          aria-label={t("previousPage")}
          onClick={() => setPageAndFetchData(controlledPageIndex - 1)}
          disabled={!canPreviousPage || dataLoading}
        >
          {"<"}
        </button>{" "}
        <button
          aria-label={t("nextPage")}
          onClick={() => setPageAndFetchData(controlledPageIndex + 1)}
          disabled={!canNextPage || dataLoading}
        >
          {">"}
        </button>{" "}
        <button
          aria-label={t("lastPage")}
          onClick={() => setPageAndFetchData(pageCount - 1)}
          disabled={!canNextPage || dataLoading}
        >
          {">>"}
        </button>{" "}
        <span>
          <strong>
            {t("pageOf", {
              page: formatExploreNumber(controlledPageIndex + 1, locale),
              pages: formatExploreNumber(pageCount, locale),
            })}
          </strong>{" "}
        </span>
        <span>
          | {t("goToPage")}{" "}
          <input
            type="number"
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageInputVal(page);
            }}
            onKeyDown={e => {
              let page = e.target.value ? Number(e.target.value) - 1 : 0;
              if (e.key === "Enter") {
                if (page > pageCount - 1) page = pageCount - 1;
                if (page < 0) page = 0;
                setPageAndFetchData(page);
              }
            }}
            onBlur={e => {
              let page = e.target.value ? Number(e.target.value) - 1 : 0;
              if (page > pageCount - 1) page = pageCount - 1;
              if (page < 0) page = 0;
              setPageAndFetchData(page);
            }}
            style={{width: "100px"}}
            value={pageInputVal + 1}
          />
        </span>{" "}
      </div>
    </div>
  );
}
