import { combineReducers } from 'redux';

const years = (
  state = [-4000, 2000],
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_YEARS":
      return action.data;
    default:
      return state;
  }
};

const explorerReducer = combineReducers({
  years,
});

export default explorerReducer;
