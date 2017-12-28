import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { operations } from '../duck';
import ErrorMessage from '../components/ErrorMessage';

import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const getRandom = gql`
  query getRandom($q: String) {
    random(q: $q) {
      _id
    }
  }
`;

const getCount = gql`
  query getCount {
    usersCount: count(type: USERS)
    postsCount: count(type: POSTS)
    commentsCount: count(type: COMMENTS)
  }
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  onQueryChange = e => {
    this.setState({ query: e.target.value });
  };

  onClickRandomPost = async e => {
    e.preventDefault();
    this.props.showLoading();

    const { query } = this.props.client;
    try {
      const response = await query({
        query: getRandom,
        variable: {
          q: this.state.query
        },
        fetchPolicy: 'network-only'
      });
      this.props.hideLoading();
      this.props.push(`/post/${response.data.random._id}`)
    } catch (error) {
      console.log('ERROR: random', error)
      this.props.hideLoading();
    }
  };

  onSubmitForm = e => {
    e.preventDefault();
    this.props.push(`/search?q=${encodeURIComponent(this.state.query)}`);
  };

  render() {
    const { data, data: { loading, error } } = this.props;

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <div className="starter-template">
        <form className="pt-5 pb-5" onSubmit={this.onSubmitForm}>
          <div className="form-group">
            <input
              id="searchBox"
              className="form-control form-control-lg"
              name="q"
              onChange={this.onQueryChange}
              value={this.state.query}
              placeholder="Search for posts (regex support)"
              aria-label="Search for posts (regex support)"
              type="text"
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary mr-2 mb-1" type="submit">
              Search
            </button>
            <input className="btn btn-secondary mb-1" name="action" value="Random Post" type="submit" onClick={this.onClickRandomPost} />
          </div>
        </form>
        {!loading && (
          <p className="lead pt-5">
            Chuyên trang tìm kiếm bài viết Reddit Vietnam
            <br /> Cảm ơn <code>{data.usersCount}</code> thành viên đã đóng góp <code>{data.postsCount}</code> bài viết và <code>{data.commentsCount}</code> bình luận.
          </p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({});

export default compose(
  withApollo,
  graphql(getCount),
  connect(mapStateToProps, {
    fetchRandomPostId: operations.fetchRandomPostId,
    push,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  })
)(Home);
