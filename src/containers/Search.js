import React, { Component } from 'react';
import { connect } from 'react-redux';
import { operations } from '../duck';
import url from 'url';
import querystring from 'querystring';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import PostContainer from '../components/Post/PostContainer';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import Pagination from '../components/Pagination';
import { getPosts } from '../utils/graphqlQuery';
import { withApollo, compose } from 'react-apollo';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
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
      this.fetchPosts();
    }
  }

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = async () => {
    this.props.showLoading();
    this.setState({ loading: true });
    this.props.setSearch(this.props.queryString.q);
    const { query } = this.props.client;

    try {
      const response = await query({
        query: getPosts,
        variables: {
          query: this.props.queryString.q,
          subreddit: this.props.queryString.r,
          first: this.props.queryString.f,
          after: this.props.queryString.a,
          last: this.props.queryString.l,
          before: this.props.queryString.b
        }
      });

      const newResult = {
        ...this.state.data,
        posts: response.data.posts
      };

      this.setState({ data: newResult });
    } catch (error) {
      this.setState({ error: error });
    }

    this.props.hideLoading();
    this.setState({ loading: false });
  };

  onClickNextPage = () => {
    const { posts } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.a = posts.pageInfo.endCursor;
    newQueryString.b = null;
    newQueryString.f = 10;
    newQueryString.l = null;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  onClickPreviousPage = () => {
    const { posts } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.a = null;
    newQueryString.b = posts.pageInfo.startCursor;
    newQueryString.f = null;
    newQueryString.l = 10;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    const { loading, error, data: { posts } } = this.state;

    if (loading) {
      return <Spinner name="three-bounce" />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!posts) {
      return null;
    }

    return (
      <div>
        <div className="alert alert-primary" role="alert">
          Tìm thấy {posts.totalCount} bài viết có từ khóa '{this.props.query}'
        </div>

        <div className="nav justify-content-end">
          <Pagination
            hasNextPage={posts.pageInfo.hasNextPage}
            hasPreviousPage={posts.pageInfo.hasPreviousPage}
            onClickNextPage={this.onClickNextPage}
            onClickPreviousPage={this.onClickPreviousPage}
          />
        </div>

        <div className="blog-main">{posts.edges && posts.edges.map(value => <PostContainer key={value.node._id} postId={value.node._id} post={value.node} />)}</div>

        <div className="nav justify-content-end">
          <Pagination
            hasNextPage={posts.pageInfo.hasNextPage}
            hasPreviousPage={posts.pageInfo.hasPreviousPage}
            onClickNextPage={this.onClickNextPage}
            onClickPreviousPage={this.onClickPreviousPage}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const query = url.parse(ownProps.location.search, true).query;
  query.q = query.q || '';
  query.r = query.r || '';
  query.a = query.a || undefined;
  query.b = query.b || undefined;
  query.f = query.f || 10;
  query.l = query.l || undefined;

  return {
    queryString: query,
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
