import { configureStore } from "@reduxjs/toolkit";
import exploreReducer from "../features/exploreSlice";
export const store = configureStore({
  reducer: {
    explore: exploreReducer,
  },
});
