// import { combineReducers } from 'redux';
import * as types from './types';

// main
const mainInitialState = {
  isLoading: false
};
export const mainReducer = (state = mainInitialState, action) => {
  switch (action.type) {
    case types.MAIN__HIDE_LOADING:
      return {
        ...state,
        isLoading: false
      };

    case types.MAIN__SHOW_LOADING:
      return {
        ...state,
        isLoading: true
      };

    default:
      return state;
  }
};

// search
const searchInitialState = {
  query: '',
};
export const searchReducer = (state = searchInitialState, action) => {
  switch (action.type) {
    case types.SEARCH__SET_QUERY:
      return {
        ...state,
        query: action.query
      };

    default:
      return state;
  }
};

//combineReducers
export default {
  main: mainReducer,
  search: searchReducer,
};
