import {createSlice} from "@reduxjs/toolkit";
import {HPI_RANGE, LANGS_RANGE, YEAR_RANGE} from "../components/utils/consts";

// Define the initial state using that type
const initialState = {
  firstLoad: true,
  city: "all",
  country: "all",
  gender: null,
  metricCutoff: 0,
  metricType: "hpi",
  occupation: "all",
  onlyShowNew: false,
  page: "rankings",
  placeType: "birthplace",
  show: {type: "people", depth: "people"},
  years: YEAR_RANGE,
  yearType: "birthyear",
  birthMonth: null,
  birthDay: null,
  nameSearch: "",
  viz: "stackedarea",
  tsScale: null, // time-series scale for stacked/line charts: null = auto, "linear" | "log"
  tsBins: null, // number of year groupings: null = auto
  stackedPercent: false, // stacked chart: show share (%) instead of counts
  value: 0,
  data: null,
  dataCount: null,
  dataLoading: false,
  dataError: null,
  dataPageIndex: 0,
  sorting: [{id: "hpi", desc: true}],
};

export const exploreSlice = createSlice({
  name: "explore",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFirstLoad: state => {
      state.firstLoad = false;
    },
    dataRequested: state => {
      state.dataLoading = true;
      state.dataError = null;
    },
    dataReceived: (state, action) => {
      const {data, count} = action.payload;
      state.data = data;
      state.dataCount = count;
      state.dataLoading = false;
    },
    dataRequestFailed: (state, action) => {
      state.dataError = action.payload;
      state.dataLoading = false;
    },
    updateYears: (state, action) => {
      const newYears = action.payload;
      state.years = newYears;
      // Re-derive the auto scale/bin defaults for the newly chosen span
      state.tsScale = null;
      state.tsBins = null;
    },
    updateGender: (state, action) => {
      state.gender = action.payload;
    },
    updateCity: (state, action) => {
      state.city = action.payload;
    },
    updateCountry: (state, action) => {
      state.country = action.payload;
      state.city = "all";
    },
    updatePlaceType: (state, action) => {
      state.placeType = action.payload;
    },
    updateOccupation: (state, action) => {
      state.occupation = action.payload;
    },
    updateMetricType: (state, action) => {
      const metricRange = action.payload === "hpi" ? HPI_RANGE : LANGS_RANGE;
      state.metricType = action.payload;
      state.metricCutoff = metricRange[0];
    },
    updateMetricCutoff: (state, action) => {
      state.metricCutoff = action.payload;
    },
    updateOnlyShowNew: (state, action) => {
      state.onlyShowNew = action.payload;
    },
    updateShowType: (state, action) => {
      const {page, showType} = action.payload;
      state.show = {type: showType, depth: showType};
      state.page = page;
      if (page === "rankings") {
        state.data = null;
        state.dataPageIndex = 0;
      }
    },
    updateShowDepth: (state, action) => {
      const {page, showDepth, showType} = action.payload;
      const pageChanged = state.page !== page;
      state.show = {type: showType, depth: showDepth};
      state.page = page;
      if (page === "rankings" || pageChanged) {
        state.data = null;
        state.dataPageIndex = 0;
      }
    },
    updateDataPageIndex: (state, action) => {
      state.dataPageIndex = action.payload;
    },
    updateSorting: (state, action) => {
      state.sorting = action.payload;
    },
    updateViz: (state, action) => {
      state.viz = action.payload;
    },
    updateYearType: (state, action) => {
      state.yearType = action.payload;
    },
    updateBirthMonth: (state, action) => {
      state.birthMonth = action.payload;
    },
    updateBirthDay: (state, action) => {
      state.birthDay = action.payload;
    },
    clearBirthDate: (state) => {
      state.birthMonth = null;
      state.birthDay = null;
    },
    updateNameSearch: (state, action) => {
      state.nameSearch = action.payload;
      state.dataPageIndex = 0;
    },
    updateTsScale: (state, action) => {
      state.tsScale = action.payload;
    },
    updateTsBins: (state, action) => {
      state.tsBins = action.payload;
    },
    updateStackedPercent: (state, action) => {
      state.stackedPercent = action.payload;
    },
  },
});

export const {
  setFirstLoad,
  dataRequested,
  dataReceived,
  dataRequestFailed,
  updateGender,
  updateYears,
  updateCity,
  updateCountry,
  updatePlaceType,
  updateOccupation,
  updateMetricType,
  updateMetricCutoff,
  updateOnlyShowNew,
  updateShowType,
  updateShowDepth,
  updateDataPageIndex,
  updateSorting,
  updateViz,
  updateYearType,
  updateBirthMonth,
  updateBirthDay,
  clearBirthDate,
  updateNameSearch,
  updateTsScale,
  updateTsBins,
  updateStackedPercent,
} = exploreSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = state => state.explore.value;

export default exploreSlice.reducer;
