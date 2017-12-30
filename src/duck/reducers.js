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

// stats
const statsInitialState = {
  chart: {},
  top: {},
  users: [],
  error: undefined
};
export const statsReducer = (state = statsInitialState, action) => {
  switch (action.type) {
    case types.STATS_STATISTICS__RECEIVE_CHART:
      return {
        ...state,
        chart: action.chart,
        error: undefined
      };

    case types.STATS_TOP__RECEIVE_LIST:
      return {
        ...state,
        top: action.top,
        error: undefined
      };

    case types.STATS__ERROR:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
};

//combineReducers
export default {
  main: mainReducer,
  search: searchReducer,
  stats: statsReducer
};
