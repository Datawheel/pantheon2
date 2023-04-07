import personProfile from "./reducers/personProfile";
import explore from "./reducers/explore";
import vb from "./reducers/vb";
import thunkMiddleware from "redux-thunk";

/**
 * This object will be used to pre-populate the redux store with any
 * static values you may need.
 */
export const initialState = {};

/**
 * This array can contain redux middlewares that will be used in the
 * redux store. The loggerMiddleware is provided as an example.
 */
export const middleware = [thunkMiddleware];

/**
 * This object should contain reducers to be combined with the internal
 * default canon reducers.
 */
export const reducers = {personProfile, explore, vb};
