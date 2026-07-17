"use client";
import {useEffect, useMemo, useState, useRef, useCallback} from "react";
import {useRouter, usePathname} from "next/navigation";
import {useSelector, useDispatch} from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {Search} from "lucide-react";
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

// Builds the visible page buttons: first, last, a window around the current
// page, and gap markers where pages are skipped (1 2 3 … 1777).
function buildPageItems(pageIndex, pageCount) {
  const candidates = new Set();
  [0, pageCount - 1, pageIndex - 1, pageIndex, pageIndex + 1].forEach(p => {
    if (p >= 0 && p < pageCount) candidates.add(p);
  });
  if (pageIndex <= 2) {
    [1, 2].forEach(p => p < pageCount && candidates.add(p));
  }
  if (pageIndex >= pageCount - 3) {
    [pageCount - 2, pageCount - 3].forEach(p => p >= 0 && candidates.add(p));
  }
  const sorted = [...candidates].sort((a, b) => a - b);
  const items = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) items.push({type: "gap", page: p});
    items.push({type: "page", page: p});
  });
  return items;
}

function PaginationNav({pageIndex, pageCount, disabled, onPage, t, locale}) {
  const items = buildPageItems(pageIndex, pageCount);
  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <nav className="ranking-pagination-nav" aria-label={t("goToPage")}>
      <button
        type="button"
        className="ranking-page-btn ranking-page-arrow"
        aria-label={t("previousPage")}
        onClick={() => onPage(pageIndex - 1)}
        disabled={!canPrevious || disabled}
      >
        ‹
      </button>
      {items.map(item =>
        item.type === "gap" ? (
          <span key={`gap-${item.page}`} className="ranking-page-gap">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item.page}
            className={`ranking-page-btn${
              item.page === pageIndex ? " is-current" : ""
            }`}
            aria-label={t("pageN", {
              page: formatExploreNumber(item.page + 1, locale),
            })}
            aria-current={item.page === pageIndex ? "page" : undefined}
            onClick={() => onPage(item.page)}
            disabled={disabled || item.page === pageIndex}
          >
            {formatExploreNumber(item.page + 1, locale)}
          </button>
        ),
      )}
      <button
        type="button"
        className="ranking-page-btn ranking-page-arrow"
        aria-label={t("nextPage")}
        onClick={() => onPage(pageIndex + 1)}
        disabled={!canNext || disabled}
      >
        ›
      </button>
    </nav>
  );
}

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

  // Year span covered by the fetched HPI histories, shown in the trend
  // column header (e.g. Trend ’23–’25).
  const trendYears = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    (data || []).forEach(row => {
      (row?.hpi_history || []).forEach(({yr}) => {
        if (yr < min) min = yr;
        if (yr > max) max = yr;
      });
    });
    return Number.isFinite(min) && max > min ? [min, max] : null;
  }, [data]);

  const columns = useMemo(
    () => getColumns(
      show.type,
      show.depth,
      controlledPageIndex * pageSize,
      {hasBirthdayFilter, nameSearch: hasNameSearch, trendYears},
      locale,
    ),
    [controlledPageIndex, show.type, show.depth, hasBirthdayFilter, hasNameSearch, trendYears, locale]
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

  const pageCount = controlledPageCount;
  const rows = table.getRowModel().rows;

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

  const rangeStart = controlledPageIndex * pageSize + 1;
  const rangeEnd = controlledPageIndex * pageSize + rows.length;
  const resultCount = dataCount !== null && rows.length ? (
    <p className="ranking-result-count">
      {t("showingRange", {
        start: formatExploreNumber(rangeStart, locale),
        end: formatExploreNumber(rangeEnd, locale),
        total: formatExploreNumber(dataCount, locale),
      })}
    </p>
  ) : (
    <p className="ranking-result-count" />
  );

  const searchPlaceholder =
    show.type === "people" && dataCount !== null && !hasNameSearch
      ? t("searchPeopleByName", {total: formatExploreNumber(dataCount, locale)})
      : t("searchByName");

  return (
    <div className="ranking-table-container">
      <div className="ranking-toolbar">
        {resultCount}
        <PaginationNav
          pageIndex={controlledPageIndex}
          pageCount={pageCount}
          disabled={dataLoading}
          onPage={setPageAndFetchData}
          t={t}
          locale={locale}
        />
        <div className="ranking-search-bar">
          <Search size={13} className="ranking-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="ranking-search-input"
            placeholder={searchPlaceholder}
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
      </div>
      <div className="ranking-table">
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
                  <td className="ranking-table-message" colSpan={999}>{t("loading")}</td>
                </tr>
              )
              : rows.length
                ? rows.map(row => (
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
                  ))
                : (
                  <tr>
                    <td className="ranking-table-message" colSpan={999}>{t("noDataFound")}</td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
      <div className="ranking-toolbar ranking-toolbar-bottom">
        <PaginationNav
          pageIndex={controlledPageIndex}
          pageCount={pageCount}
          disabled={dataLoading}
          onPage={setPageAndFetchData}
          t={t}
          locale={locale}
        />
        <span className="ranking-goto">
          {t("goToPage")}{" "}
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
            value={pageInputVal + 1}
          />
        </span>
      </div>
    </div>
  );
}
