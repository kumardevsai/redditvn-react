import * as types from './types';

// main
export const main__ShowLoading = () => ({
  type: types.MAIN__SHOW_LOADING
});

export const main__HideLoading = () => ({
  type: types.MAIN__HIDE_LOADING
});

// search
export const search__Error = error => ({
  type: types.SEARCH__ERROR,
  error
});

export const search__SetQuery = query => ({
  type: types.SEARCH__SET_QUERY,
  query: query
});

export const search__ReceivePosts = posts => ({
  type: types.SEARCH__RECEIVE_POSTS,
  posts: posts
});

// user
export const user__Error = error => ({
  type: types.USER__ERROR,
  error
});

export const user__ReceiveInfo = info => ({
  type: types.USER__RECEIVE_INFO,
  info: info
});

export const user__ReceivePosts = posts => ({
  type: types.USER__RECEIVE_POSTS,
  posts: posts
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

export const stats_user__ReceiveUsers = users => ({
  type: types.STATS_USER__RECEIVE_USERS,
  users: users
});
