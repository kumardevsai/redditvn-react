import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from '../components/Pagination';
import url from 'url';
import querystring from 'querystring';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import PostContainer from '../components/Post/PostContainer';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import _ from 'lodash';
import { operations } from '../duck';

import { withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const getPostsWithSubReddit = gql`
query getPostsWithSubReddit($displayName: String!, $subreddit: String, $first: Int, $after: String, $last: Int, $before: String) {
  r(displayName: $displayName) {
    display_name
    accounts_active
    icon_img
    subscribers
  }
  posts(first: $first, after: $after, last: $last, before: $before, r: $subreddit) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
      totalCount
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
`;

class SubReddit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.props.showLoading();
      const { query } = this.props.client;
      const response = await query({
        query: getPostsWithSubReddit,
        variables: {
          displayName: this.props.subreddit,
          subreddit: this.props.subreddit,
          first: this.props.queryString.f,
          after: this.props.queryString.a,
          last: this.props.queryString.l,
          before: this.props.queryString.b
        }
      });

      const newResult = {
        ...this.state.data,
        data: {
          ...this.state.data.data,
          posts: response.data.posts
        }
      };

      this.setState({ data: newResult });
      this.props.hideLoading();
    }
  }

  async componentDidMount() {
    this.props.showLoading();
    const { query } = this.props.client;

    const response = await query({
      query: getPostsWithSubReddit,
      variables: {
        displayName: this.props.subreddit,
        subreddit: this.props.subreddit,
        first: this.props.queryString.f,
        after: this.props.queryString.a,
        last: this.props.queryString.l,
        before: this.props.queryString.b
      }
    });

    this.setState({ data: response });
    this.props.hideLoading();
  }

  onClickNextPagePost = () => {
    const { data: { posts } } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.a = posts.pageInfo.endCursor;
    newQueryString.b = null;
    newQueryString.f = 10;
    newQueryString.l = null;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  onClickPreviousPagePost = () => {
    const { data: { posts } } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.a = null;
    newQueryString.b = posts.pageInfo.startCursor;
    newQueryString.f = null;
    newQueryString.l = 10;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    const { data: { loading, error, data } } = this.state;

    if (loading) {
      return <Spinner name="three-bounce" />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!data || !data.posts) {
      return null;
    }

    const { posts, r } = data;

    return (
      <div>
        <div className="user-info text-center">
          <div className="user-image">
            <LazyImage className="rounded-circle fb-avatar" src={r.icon_img} alt={r.display_name} height="8rem" width="8rem" />
          </div>
          <div className="user-detail">
            <h3>
              <a href={`https://reddit.com/r/${r.display_name}`}>{r.display_name}</a>
            </h3>
          </div>
        </div>

        <div className="nav justify-content-end">
          <Pagination
            hasNextPage={posts.pageInfo.hasNextPage}
            hasPreviousPage={posts.pageInfo.hasPreviousPage}
            onClickNextPage={this.onClickNextPagePost}
            onClickPreviousPage={this.onClickPreviousPagePost}
          />
        </div>

        <div className="blog-main">{posts.edges && posts.edges.map(value => <PostContainer key={value.node._id} postId={value.node._id} post={value.node} />)}</div>

        <div className="nav justify-content-end">
          <Pagination
            hasNextPage={posts.pageInfo.hasNextPage}
            hasPreviousPage={posts.pageInfo.hasPreviousPage}
            onClickNextPage={this.onClickNextPagePost}
            onClickPreviousPage={this.onClickPreviousPagePost}
          />
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const query = url.parse(ownProps.location.search, true).query;
  query.a = query.a || null;
  query.b = query.b || null;
  query.f = query.f || 10;
  query.l = query.l || null;

  return {
    queryString: query,
    subreddit: ownProps.match.params.subreddit
  };
};

export default compose(
  connect(mapStateToProps, {
    push,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  }),
  withApollo
)(SubReddit);
