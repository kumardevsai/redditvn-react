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

class Search extends Component {
  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) === true) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.fetchNewSearch();
    }
  }

  componentDidMount() {
    this.fetchNewSearch();
  }

  fetchNewSearch = () => {
    this.props.setSearch(this.props.queryString.q);
    this.props.fetchSearchPosts(this.props.queryString.q, this.props.queryString.page, this.props.queryString.limit);
  };

  onPageChange = ({ selected }) => {
    const newQueryString = { ...this.props.queryString, page: selected + 1 };
    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    if (this.props.error) {
      return <ErrorMessage error={this.props.error} />;
    }

    if (!this.props.posts.docs) {
      return null;
    }

    const curPage = parseInt(this.props.posts.page - 1, 10);

    const pagnite =
      this.props.posts.docs.length > 0 ? (
        <div className="nav justify-content-end">
          <CustomPaginate currentPage={curPage} totalPage={this.props.posts.pages} onPageChange={this.onPageChange} />
        </div>
      ) : null;

    return (
      <div>
        <div className="alert alert-primary" role="alert">
          Tìm thấy {this.props.posts.total} bài viết có từ khóa '{this.props.query}'
        </div>

        {pagnite}

        <div className="blog-main">{this.props.posts.docs && this.props.posts.docs.map(value => <PostContainer key={value._id} postId={value._id} post={value} />)}</div>

        {pagnite}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const parsed = url.parse(ownProps.location.search, true).query;
  if (!parsed.q) parsed.q = '';
  if (!parsed.page) parsed.page = 1;
  if (!parsed.limit) parsed.limit = 10;

  return {
    queryString: parsed,
    posts: state.search.posts,
    query: state.search.query,
    error: state.search.error
  };
};

export default connect(mapStateToProps, {
  fetchSearchPosts: operations.fetchSearchPosts,
  setSearch: operations.setSearch,
  push
})(Search);
