import * as types from './types';

// main
export const main__ShowLoading = () => ({
  type: types.MAIN__SHOW_LOADING
});

export const main__HideLoading = () => ({
  type: types.MAIN__HIDE_LOADING
});

// home
export const home__ReceiveInfo = stats_count => ({
  type: types.HOME__RECEIVE_INFO,
  stats_count: stats_count
});

export const home__Error = error => ({
  type: types.HOME__ERROR,
  error
});

// post
export const post__Error = error => ({
  type: types.POST__ERROR,
  error
});

export const post__CleanPost = () => ({
  type: types.POST__CLEAN_POST
});

export const post__ReceivePost = post => ({
  type: types.POST__RECEIVE_POST,
  detail: post
});

export const post__RequestComment = () => ({
  type: types.POST__REQUEST_COMMENTS
});

export const post__ReceiveComment = comments => ({
  type: types.POST__RECEIVE_COMMENTS,
  comments: comments
});

export const post__ReceiveImages = images => ({
  type: types.POST__RECEIVE_IMAGES,
  images: images
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
