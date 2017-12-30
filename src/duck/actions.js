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

