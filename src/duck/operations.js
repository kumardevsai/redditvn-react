import * as actions from './actions';
import { replace } from 'react-router-redux';
import axios from 'axios';
import querystring from 'querystring';

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

export const fetchSearchPosts = (query, page, limit) => dispatch => {
  if (query.startsWith('user:')) {
    const userId = query.substr(5);
    return dispatch(replace(`/user/${userId}`));
  } else if (query.startsWith('post:')) {
    const postId = query.substr(5);
    return dispatch(replace(`/post/${postId}`));
  }

  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_API_URI}/search?${querystring.stringify({ q: query, page, limit })}`)
    .then(response => {
      dispatch(actions.search__ReceivePosts(response.data));
      dispatch(actions.main__HideLoading());
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.search__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

// user
export const fetchUserInfo = user_id => (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_API_URI}/users/${user_id}`)
    .then(response => {
      dispatch(actions.user__ReceiveInfo(response.data));
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.user__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

export const fetchUserPosts = (user_id, page, limit) => (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_API_URI}/users/${user_id}/posts?${querystring.stringify({ page, limit })}`)
    .then(response => {
      dispatch(actions.user__ReceivePosts(response.data));
      dispatch(actions.main__HideLoading());
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.main__HideLoading());
    });
};

// stats
export const fetchUserList = (page, limit) => (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_API_URI}/users?${querystring.stringify({ page, limit })}`)
    .then(response => {
      dispatch(actions.stats_user__ReceiveUsers(response.data));
      dispatch(actions.main__HideLoading());
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.stats__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

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
