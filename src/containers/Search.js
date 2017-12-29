import React, { Component } from 'react';
import { connect } from 'react-redux';
import { operations } from '../duck';
import CustomPaginate from '../components/CustomPaginate';
import url from 'url';
import querystring from 'querystring';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import PostContainer from '../components/Post/PostContainer';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import Pagination from '../components/Pagination';

import { withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const getPosts = gql`
  query getPosts($query: String, $first: Int, $after: String, $last: Int, $before: String) {
    posts(first: $first, after: $after, last: $last, before: $before, q: $query) {
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

class Search extends Component {
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
      this.props.setSearch(this.props.queryString.q);
      const { query } = this.props.client;
      const response = await query({
        query: getPosts,
        variables: {
          query: this.props.queryString.q,
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
    this.props.setSearch(this.props.queryString.q);

    const { query } = this.props.client;
    const response = await query({
      query: getPosts,
      variables: {
        query: this.props.queryString.q,
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

    const posts = data.posts;

    return (
      <div>
        <div className="alert alert-primary" role="alert">
          Tìm thấy {posts.pageInfo.totalCount} bài viết có từ khóa '{this.props.query}'
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
  const parsed = url.parse(ownProps.location.search, true).query;
  parsed.q = parsed.q || '';
  parsed.a = parsed.a || null;
  parsed.b = parsed.b || null;
  parsed.f = parsed.f || 10;
  parsed.l = parsed.l || null;

  return {
    queryString: parsed,
    query: state.search.query
  };
};

export default compose(
  connect(mapStateToProps, {
    push,
    setSearch: operations.setSearch,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  }),
  withApollo
)(Search);
