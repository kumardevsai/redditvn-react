import * as actions from './actions';
import { push, replace } from 'react-router-redux';
import axios from 'axios';
import querystring from 'querystring';

// main
export const showLoading = () => {
  return actions.main__ShowLoading();
};

export const hideLoading = () => {
  return actions.main__HideLoading();
};

// home
export const fetchInfo = () => (dispatch, getState) => {
  const { postCount } = getState().home.info;
  if (postCount !== 0) {
    return;
  }

  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/info`)
    .then(response => {
      dispatch(actions.home__ReceiveInfo(response.data));
      dispatch(actions.main__HideLoading());
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.home__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

export const fetchRandomPostId = query => (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/random?q=${query}`)
    .then(response => {
      dispatch(push(`/post/${response.data._id}`));
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.home__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

// post
export const fetchPostById = post_id => (dispatch, getState) => {
  dispatch(actions.post__CleanPost());
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/post/${post_id}`)
    .then(response => {
      dispatch(actions.post__ReceivePost(response.data));
      dispatch(actions.main__HideLoading());
      dispatch(fetchImageByPostId(post_id));
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.post__Error(error));
      dispatch(actions.main__HideLoading());
    });
};

export const fetchCommentByPostId = post_id => (dispatch, getState) => {
  dispatch(actions.post__RequestComment());
  axios
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/post/${post_id}/comments`)
    .then(response => {
      dispatch(actions.post__ReceiveComment(response.data));
    })
    .catch(error => {
      console.log(error);
    });
};

export const fetchImageByPostId = post_id => (dispatch, getState) => {
  axios
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/post/${post_id}/attachments`)
    .then(response => {
      dispatch(actions.post__ReceiveImages(response.data));
    })
    .catch(error => {
      console.log(error);
    });
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
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/search?${querystring.stringify({ q: query, page, limit })}`)
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
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/user/${user_id}`)
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
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/user/${user_id}/posts?${querystring.stringify({ page, limit })}`)
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
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/stats/user?${querystring.stringify({ page, limit })}`)
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
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/stats/?type=${type}&group=${group}`)
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

export const fetchTop = (limit, group) => (dispatch, getState) => {
  dispatch(actions.main__ShowLoading());
  axios
    .get(`${process.env.REACT_APP_SEARCH_REDDITVN_API_URI}/stats/top/?limit=${limit}&group=${group}`)
    .then(response => {
      dispatch(actions.stats_top__ReceiveList(response.data));
      dispatch(actions.main__HideLoading());
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.stats__Error(error));
      dispatch(actions.main__HideLoading());
    });
};
