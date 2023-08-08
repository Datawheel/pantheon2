import { createSlice } from "@reduxjs/toolkit";
import { YEAR_RANGE } from "../components/utils/consts";

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
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
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
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  dataRequested,
  dataReceived,
  dataRequestFailed,
  updateGender,
  updateYears,
  updateCity,
  updateCountry,
  updatePlaceType,
  updateOccupation,
} = exploreSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state) => state.explore.value;

export default exploreSlice.reducer;
