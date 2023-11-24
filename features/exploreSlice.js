import { createSlice } from "@reduxjs/toolkit";
import { HPI_RANGE, LANGS_RANGE, YEAR_RANGE } from "../components/utils/consts";

// Define the initial state using that type
const initialState = {
  city: "all",
  country: "all",
  gender: null,
  metricCutoff: 0,
  metricType: "hpi",
  occupation: "all",
  onlyShowNew: false,
  page: "rankings",
  placeType: "birthplace",
  show: { type: "people", depth: "people" },
  years: YEAR_RANGE,
  yearType: "birthyear",
  value: 0,
  data: null,
  dataLoading: false,
  dataError: null,
};

export const exploreSlice = createSlice({
  name: "explore",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    dataRequested: (state) => {
      state.dataLoading = true;
      state.dataError = null;
    },
    dataReceived: (state, action) => {
      state.data = action.payload;
      state.dataLoading = false;
    },
    dataRequestFailed: (state, action) => {
      state.dataError = action.payload;
      state.dataLoading = false;
    },
    updateYears: (state, action) => {
      const newYears = action.payload;
      state.years = newYears;
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
      const { page, showType } = action.payload;
      state.show = { type: showType, depth: showType };
      state.page = page;
      if (page === "rankings") {
        state.data = null;
      }
    },
    updateShowDepth: (state, action) => {
      const { type } = state;
      const { page, showDepth, showType } = action.payload;
      console.log("\n~~~~~~~showType:", showType, "\n~~~~~~~~~~``");
      state.show = { type: showType, depth: showDepth };
      state.page = page;
      if (page === "rankings") {
        state.data = null;
      }
    },
  },
});

export const {
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
} = exploreSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state) => state.explore.value;

export default exploreSlice.reducer;
