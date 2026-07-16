/*eslint no-undefined: "error"*/
"use client";
import {useEffect, useMemo} from "react";
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import {useSelector, useDispatch} from "react-redux";
import VizTitle from "../components/explore/VizTitle";
import Controls from "../components/explore/Controls";
import Spinner from "../components/Spinner";
import RankingTable from "../components/explore/rankings/RankingTable";
import {
  buildNestedOccupations,
  buildRankingsMetadata,
  buildRankingsMetricSentence,
  parseRankingsSearchParams,
} from "@/lib/rankings";
import {
  formatExploreYear,
  getExploreTranslations,
} from "@/app/exploreTranslations";
import {localizePath} from "@/app/utils/hreflang";
import {fetchDataAndDispatch, getQueryArgs} from "../components/utils/exploreHelpers";
import {
  setFirstLoad,
  updateCountry,
  updateCity,
  updateGender,
  updateMetricCutoff,
  updateMetricType,
  updatePlaceType,
  updateYears,
  updateYearType,
  updateViz,
  updateShowDepth,
  updateOccupation,
  updateOnlyShowNew,
  updateBirthMonth,
  updateBirthDay,
  updateTsScale,
  updateTsBins,
  updateStackedPercent,
} from "./exploreSlice";
import "./Explore.css";
import VizShell from "../components/explore/viz/VizShell";

function Explore({
  baseApi,
  places,
  occupations,
  pageType,
  locale,
  embed = false,
  initialExploreState = null,
}) {
  const {
    firstLoad,
    data,
  } = useSelector(state => state.explore);
  const exploreState = useSelector(state => state.explore);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = getExploreTranslations(locale);

  const nestedOccupations = buildNestedOccupations(occupations, locale);
  const routeExploreState = initialExploreState
    || parseRankingsSearchParams(searchParams, occupations, pageType);
  const pageChanged = exploreState.page !== pageType;
  const effectiveExploreState =
    firstLoad || pageChanged
      ? {...exploreState, ...routeExploreState, page: pageType}
      : exploreState;
  const filterFetchState = useMemo(() => ({
    city: exploreState.city,
    country: exploreState.country,
    gender: exploreState.gender,
    metricCutoff: exploreState.metricCutoff,
    metricType: exploreState.metricType,
    occupation: exploreState.occupation,
    onlyShowNew: exploreState.onlyShowNew,
    page: exploreState.page,
    placeType: exploreState.placeType,
    show: {
      type: exploreState.show.type,
      depth: exploreState.show.depth,
    },
    viz: exploreState.viz,
    years: exploreState.years,
    yearType: exploreState.yearType,
    birthMonth: exploreState.birthMonth,
    birthDay: exploreState.birthDay,
    nameSearch: exploreState.nameSearch,
    dataPageIndex: exploreState.dataPageIndex,
    sorting: exploreState.sorting,
    // Client-only viz options: read here so getQueryArgs keeps them in the URL,
    // but intentionally excluded from the deps below so toggling them does NOT
    // trigger a data refetch (they don't affect the API query).
    tsScale: exploreState.tsScale,
    tsBins: exploreState.tsBins,
    stackedPercent: exploreState.stackedPercent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    exploreState.birthDay,
    exploreState.birthMonth,
    exploreState.city,
    exploreState.country,
    exploreState.dataPageIndex,
    exploreState.gender,
    exploreState.metricCutoff,
    exploreState.metricType,
    exploreState.nameSearch,
    exploreState.occupation,
    exploreState.onlyShowNew,
    exploreState.page,
    exploreState.placeType,
    exploreState.sorting,
    exploreState.show.depth,
    exploreState.show.type,
    exploreState.viz,
    exploreState.years,
    exploreState.yearType,
  ]);

  useEffect(() => {
    const initialState = routeExploreState;

    dispatch(
      updateShowDepth({
        showType: initialState.show.type,
        showDepth: initialState.show.depth,
        page: pageType,
      })
    );
    dispatch(updateOccupation(initialState.occupation));
    dispatch(updateCountry(initialState.country));
    dispatch(updateCity(initialState.city));
    dispatch(updatePlaceType(initialState.placeType));
    dispatch(updateGender(initialState.gender));
    dispatch(updateYears(initialState.years));
    dispatch(updateYearType(initialState.yearType));
    dispatch(updateViz(initialState.viz));
    dispatch(updateMetricType(initialState.metricType));
    dispatch(updateMetricCutoff(initialState.metricCutoff));
    dispatch(updateOnlyShowNew(initialState.onlyShowNew));
    dispatch(updateBirthMonth(initialState.birthMonth));
    dispatch(updateBirthDay(initialState.birthDay));
    dispatch(updateTsScale(initialState.tsScale ?? null));
    dispatch(updateTsBins(initialState.tsBins ?? null));
    dispatch(updateStackedPercent(initialState.stackedPercent ?? false));
    dispatch(setFirstLoad());
    // Rehydrate when navigating between Explore routes. The Redux provider is
    // shared across routes, so rankings state can otherwise leak into viz (and
    // vice versa) during client-side navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType, pathname]);

  useEffect(() => {
    if (!firstLoad && !pageChanged) {
      fetchDataAndDispatch(
        baseApi,
        places,
        filterFetchState,
        dispatch,
        router,
        pathname,
        null,
        filterFetchState.sorting,
        !embed,
        locale,
      );
    }
  }, [
    firstLoad,
    pageChanged,
    exploreState.city,
    exploreState.country,
    exploreState.gender,
    exploreState.metricCutoff,
    exploreState.metricType,
    exploreState.occupation,
    exploreState.onlyShowNew,
    exploreState.placeType,
    exploreState.sorting,
    exploreState.show.depth,
    exploreState.show.type,
    exploreState.years,
    exploreState.yearType,
    exploreState.birthMonth,
    exploreState.birthDay,
    exploreState.nameSearch,
    filterFetchState,
    baseApi,
    places,
    dispatch,
    router,
    pathname,
    embed,
    locale,
  ]);

  // Keep document.title, the description meta, and the canonical link in
  // sync with the active rankings filters. The URL is updated via
  // window.history.replaceState (see fetchDataAndDispatch), which bypasses
  // Next.js's router — without this effect, generateMetadata never re-runs
  // and the SSR title/canonical get stuck on whatever the user first landed
  // on. SSR still renders the correct initial values, so we skip on first
  // load to avoid a redundant write.
  useEffect(() => {
    if (firstLoad || embed || pageType !== "rankings") return;
    if (typeof document === "undefined") return;
    const metadata = buildRankingsMetadata(
      effectiveExploreState,
      places,
      nestedOccupations,
      locale,
    );
    if (document.title !== metadata.title) {
      document.title = metadata.title;
    }
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && descMeta.getAttribute("content") !== metadata.description) {
      descMeta.setAttribute("content", metadata.description);
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      const origin = canonicalLink.getAttribute("href")?.match(/^https?:\/\/[^/]+/)?.[0]
        || "https://pantheon.world";
      const nextCanonical = `${origin}${localizePath(locale, metadata.canonicalPath)}`;
      if (canonicalLink.getAttribute("href") !== nextCanonical) {
        canonicalLink.setAttribute("href", nextCanonical);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstLoad,
    embed,
    pageType,
    locale,
    places,
    nestedOccupations,
    effectiveExploreState.city,
    effectiveExploreState.country,
    effectiveExploreState.gender,
    effectiveExploreState.metricCutoff,
    effectiveExploreState.metricType,
    effectiveExploreState.occupation,
    effectiveExploreState.onlyShowNew,
    effectiveExploreState.placeType,
    effectiveExploreState.show.depth,
    effectiveExploreState.show.type,
    effectiveExploreState.years,
    effectiveExploreState.yearType,
    effectiveExploreState.birthMonth,
    effectiveExploreState.birthDay,
  ]);

  // Sync stacked/line client-only options (scale, bins, percent) to the URL
  // without triggering a data refetch (they don't affect the API query).
  useEffect(() => {
    if (firstLoad || embed || pageType !== "viz") return;
    if (typeof window === "undefined") return;
    const queryStr = getQueryArgs(exploreState);
    const nextUrl = `${pathname}${queryStr}`;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstLoad,
    embed,
    pageType,
    pathname,
    exploreState.tsScale,
    exploreState.tsBins,
    exploreState.stackedPercent,
  ]);

  const metricSentence = buildRankingsMetricSentence(effectiveExploreState, locale);

  const activeData = pageChanged ? null : data;
  const vizContent = activeData ? (
    pageType === "rankings" ? (
      <RankingTable baseApi={baseApi} places={places} locale={locale} />
    ) : (
      <VizShell occupations={occupations} locale={locale} />
    )
  ) : (
    <div style={{position: "relative", width: "100%"}}>
      <Spinner label={t("loading")} />
    </div>
  );

  if (embed) {
    return (
      <div className="explore-embed">
        <div className="explore-head">
          <VizTitle
            places={places}
            nestedOccupations={nestedOccupations}
            exploreState={effectiveExploreState}
            locale={locale}
          />
        </div>
        <div className="explore-body">{vizContent}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="explore-head">
        <VizTitle
          places={places}
          nestedOccupations={nestedOccupations}
          exploreState={effectiveExploreState}
          locale={locale}
        />
        {effectiveExploreState.years.length ? (
          <h3 className="explore-date">
            {formatExploreYear(effectiveExploreState.years[0], locale)} - {formatExploreYear(effectiveExploreState.years[1], locale)}
          </h3>
        ) : null}
        {metricSentence ? <p>{metricSentence}</p> : null}
      </div>
      <div className="explore-body">
        <Controls
          nestedOccupations={nestedOccupations}
          places={places}
          locale={locale}
          pageType={pageType}
        />
        {vizContent}
      </div>
    </div>
  );
}

export default Explore;
