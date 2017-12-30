import * as types from './types';

// main
export const main__ShowLoading = () => ({
  type: types.MAIN__SHOW_LOADING
});

export const main__HideLoading = () => ({
  type: types.MAIN__HIDE_LOADING
});

export const search__SetQuery = query => ({
  type: types.SEARCH__SET_QUERY,
  query: query
});

// stats
export const stats__Error = error => ({
  type: types.STATS__ERROR,
  error
});

export const stats_statistic__ReceiveChart = chart => ({
  type: types.STATS_STATISTICS__RECEIVE_CHART,
  chart: chart
});

export const stats_top__ReceiveList = top => ({
  type: types.STATS_TOP__RECEIVE_LIST,
  top: top
});

