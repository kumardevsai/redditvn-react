import * as actions from './actions';

// main
export const showLoading = () => {
  return actions.main__ShowLoading();
};

export const hideLoading = () => {
  return actions.main__HideLoading();
};

// search
export const setSearch = query => {
  return actions.search__SetQuery(query);
};
