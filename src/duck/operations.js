import * as actions from './actions';
import axios from 'axios';

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

// stats
export const fetchStatistics = (type, group) => (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_API_URI}/stats/chart/?type=${type}&group=${group}`)
    .then(response => {
      dispatch(actions.stats_statistic__ReceiveChart(response.data));
      dispatch(actions.main__HideLoading());
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.stats__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

export const fetchTop = (limit, since, until) => async (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  try {
    const topUsersRes = await axios.get(`${process.env.REACT_APP_API_URI}/users/top/?limit=${limit}&since=${since}&until=${until}`);
    const topLikesRes = await axios.get(`${process.env.REACT_APP_API_URI}/posts/top/likes/?limit=${limit}&since=${since}&until=${until}`);
    const topCommentsRes = await axios.get(`${process.env.REACT_APP_API_URI}/posts/top/comments/?limit=${limit}&since=${since}&until=${until}`);

    dispatch(actions.stats_top__ReceiveList({
      top_users: topUsersRes.data.docs,
      top_likes: topLikesRes.data.docs,
      top_comments: topCommentsRes.data.docs
    }));
    dispatch(actions.main__HideLoading());
  } catch (error) {
    console.log(error);
      dispatch(actions.stats__Error(error));
      dispatch(actions.main__HideLoading());
  }
};
