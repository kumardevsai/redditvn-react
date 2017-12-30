import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from '../components/Pagination';
import url from 'url';
import querystring from 'querystring';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import PostContainer from '../components/Post/PostContainer';
import LazyImage from '../components/LazyImage';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import PostCommentDetail from '../components/Post/PostCommentDetail';
import _ from 'lodash';
import classNames from 'classnames';
import { operations } from '../duck';

import { withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const getUser = gql`
  query getUser(
    $user_id: String!
    $post_first: Int
    $post_after: String
    $post_last: Int
    $post_before: String
    $comment_first: Int
    $comment_after: String
    $comment_last: Int
    $comment_before: String
  ) {
    user(id: $user_id) {
      _id
      name
      profile_pic(size: 128)
      posts_count
      comments_count
      posts(first: $post_first, after: $post_after, last: $post_last, before: $post_before) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            _id
            user {
              _id
              name
              profile_pic
            }
            r
            u
            message
            created_time
            comments_count
            likes_count
            is_deleted
          }
        }
      }
      comments(first: $comment_first, after: $comment_after, last: $comment_last, before: $comment_before) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            _id
            user {
              _id
              name
              profile_pic
            }
            message
            created_time
          }
        }
      }
    }
  }
`;

const getUserPosts = gql`
  query getUser($user_id: String!, $post_first: Int, $post_after: String, $post_last: Int, $post_before: String) {
    user(id: $user_id) {
      _id
      posts(first: $post_first, after: $post_after, last: $post_last, before: $post_before) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            _id
            user {
              _id
              name
              profile_pic
            }
            r
            u
            message
            created_time
            comments_count
            likes_count
            is_deleted
          }
        }
      }
    }
  }
`;

const getUserComments = gql`
  query getUser($user_id: String!, $comment_first: Int, $comment_after: String, $comment_last: Int, $comment_before: String) {
    user(id: $user_id) {
      _id
      comments(first: $comment_first, after: $comment_after, last: $comment_last, before: $comment_before) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            _id
            user {
              _id
              name
              profile_pic
            }
            message
            created_time
          }
        }
      }
    }
  }
`;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      loading_posts: false,
      loading_comments: false,
      error: undefined
    };
  }

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      if (this.props.queryString.ca !== prevProps.queryString.ca || this.props.queryString.cb !== prevProps.queryString.cb) {
        this.fetchUserComments();
      }

      if (this.props.queryString.pa !== prevProps.queryString.pa || this.props.queryString.pb !== prevProps.queryString.pb) {
        this.fetchUserPosts();
      }
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    this.props.showLoading();
    this.setState({ loading: true });
    const { query } = this.props.client;

    try {
      const response = await query({
        query: getUser,
        variables: {
          user_id: this.props.userId,
          post_first: this.props.queryString.pf,
          post_after: this.props.queryString.pa,
          post_last: this.props.queryString.pl,
          post_before: this.props.queryString.pb,
          comment_first: this.props.queryString.cf,
          comment_after: this.props.queryString.ca,
          comment_last: this.props.queryString.cl,
          comment_before: this.props.queryString.cb
        }
      });

      this.setState({ data: response.data });
    } catch (error) {
      this.setState({ error: error });
    }

    this.props.hideLoading();
    this.setState({ loading: false });
  };

  fetchUserPosts = async () => {
    this.setState({ loading_posts: true });
    const { query } = this.props.client;

    try {
      const response = await query({
        query: getUserPosts,
        variables: {
          user_id: this.props.userId,
          post_first: this.props.queryString.pf,
          post_after: this.props.queryString.pa,
          post_last: this.props.queryString.pl,
          post_before: this.props.queryString.pb
        }
      });

      const newResult = {
        ...this.state.data,
        user: {
          ...this.state.data.user,
          posts: response.data.user.posts
        }
      };

      this.setState({ data: newResult });
    } catch (error) {
      this.setState({ error: error });
    }

    this.setState({ loading_posts: false });
  };

  fetchUserComments = async () => {
    this.props.showLoading();
    this.setState({ loading_comments: true });
    const { query } = this.props.client;

    try {
      const response = await query({
        query: getUserComments,
        variables: {
          user_id: this.props.userId,
          comment_first: this.props.queryString.cf,
          comment_after: this.props.queryString.ca,
          comment_last: this.props.queryString.cl,
          comment_before: this.props.queryString.cb
        }
      });

      const newResult = {
        ...this.state.data,
        user: {
          ...this.state.data.user,
          comments: response.data.user.comments
        }
      };

      this.setState({ data: newResult });
    } catch (error) {
      this.setState({ error: error });
    }

    this.props.hideLoading();
    this.setState({ loading_comments: false });
  };

  onClickNextPagePost = () => {
    const { user } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.pa = _.last(user.posts.edges).cursor;
    newQueryString.pb = null;
    newQueryString.pf = 10;
    newQueryString.pl = null;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  onClickPreviousPagePost = () => {
    const { user } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.pa = null;
    newQueryString.pb = _.first(user.posts.edges).cursor;
    newQueryString.pf = null;
    newQueryString.pl = 10;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  onClickNextPageComment = () => {
    const { user } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.ca = _.last(user.comments.edges).cursor;
    newQueryString.cb = null;
    newQueryString.cf = 30;
    newQueryString.cl = null;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  onClickPreviousPageComment = () => {
    const { user } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.ca = null;
    newQueryString.cb = _.first(user.comments.edges).cursor;
    newQueryString.cf = null;
    newQueryString.cl = 30;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    const { loading, error, loading_posts, loading_comments, data: { user } } = this.state;

    if (loading) {
      return <Spinner name="three-bounce" />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!user) {
      return null;
    }

    return (
      <div>
        {user && (
          <div className="user-info text-center">
            <div className="user-image">
              <LazyImage className="rounded-circle fb-avatar" src={user.profile_pic} alt={user.name} height="8rem" width="8rem" />
            </div>
            <div className="user-detail">
              <h3>
                <a href={`https://www.facebook.com/${user._id}`}>{user.name}</a>
              </h3>
            </div>
          </div>
        )}

        {user && (
          <ul className="nav nav-pills flex-column flex-sm-row mb-3" id="list-tab" role="tablist">
            <li className="nav-item">
              <a className={classNames('nav-link', 'active')} data-toggle="tab" href="#posts" role="tab">
                Posts
                <span className="badge badge-secondary badge-pill ml-2">{user.posts_count}</span>
              </a>
            </li>

            <li className="nav-item">
              <a className={classNames('nav-link', { active: this.props.queryString.show === 'comments' })} data-toggle="tab" href="#comments" role="tab">
                Comments
                <span className="badge badge-secondary badge-pill ml-2">{user.comments_count}</span>
              </a>
            </li>
          </ul>
        )}

        <div className="tab-content">
          <div className={classNames('tab-pane', 'active')} id="posts" role="tabpanel">
            {loading_posts ? (
              <Spinner name="three-bounce" />
            ) : (
              user.posts &&
              user.posts.edges && (
                <div>
                  <div className="nav justify-content-end">
                    <Pagination
                      hasNextPage={user.posts.pageInfo.hasNextPage}
                      hasPreviousPage={user.posts.pageInfo.hasPreviousPage}
                      onClickNextPage={this.onClickNextPagePost}
                      onClickPreviousPage={this.onClickPreviousPagePost}
                    />
                  </div>
                  {user.posts.edges.map(value => <PostContainer key={value.node._id} postId={value.node._id} post={value.node} />)}
                  <div className="nav justify-content-end">
                    <Pagination
                      hasNextPage={user.posts.pageInfo.hasNextPage}
                      hasPreviousPage={user.posts.pageInfo.hasPreviousPage}
                      onClickNextPage={this.onClickNextPagePost}
                      onClickPreviousPage={this.onClickPreviousPagePost}
                    />
                  </div>
                </div>
              )
            )}
          </div>

          <div className={classNames('tab-pane')} id="comments" role="tabpanel">
            {loading_comments ? (
              <Spinner name="three-bounce" />
            ) : (
              user.comments &&
              user.comments.edges && (
                <div>
                  <div className="nav justify-content-end">
                    <Pagination
                      hasNextPage={user.comments.pageInfo.hasNextPage}
                      hasPreviousPage={user.comments.pageInfo.hasPreviousPage}
                      onClickNextPage={this.onClickNextPageComment}
                      onClickPreviousPage={this.onClickPreviousPageComment}
                    />
                  </div>
                  <div className={classNames('card mb-3')}>
                    <div className="card-header">
                      <PostCommentDetail comments={user.comments} />
                    </div>
                  </div>
                  <div className="nav justify-content-end">
                    <Pagination
                      hasNextPage={user.comments.pageInfo.hasNextPage}
                      hasPreviousPage={user.comments.pageInfo.hasPreviousPage}
                      onClickNextPage={this.onClickNextPageComment}
                      onClickPreviousPage={this.onClickPreviousPageComment}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const query = url.parse(ownProps.location.search, true).query;
  query.pa = query.pa || null;
  query.pb = query.pb || null;
  query.pf = query.pf || 10;
  query.pl = query.pl || null;

  query.ca = query.ca || null;
  query.cb = query.cb || null;
  query.cf = query.cf || 30;
  query.cl = query.cl || null;

  return {
    queryString: query,
    userId: ownProps.match.params.user_id
  };
};

export default compose(
  connect(mapStateToProps, {
    push,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  }),
  withApollo
)(User);
