import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomPaginate from '../components/CustomPaginate';
import url from 'url';
import querystring from 'querystring';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import PostContainer from '../components/Post/PostContainer';
import { Link } from 'react-router-dom';
import { operations } from '../duck';
import LazyImage from '../components/LazyImage';
import ErrorMessage from '../components/ErrorMessage';

class User extends Component {
  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) === true) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.fetchNewUserPost();
    }
  }

  componentDidMount() {
    this.props.fetchUserInfo(this.props.userId);
    this.fetchNewUserPost();
  }

  fetchNewUserPost = () => {
    this.props.fetchUserPosts(this.props.userId, this.props.queryString.page, this.props.queryString.limit);
  };

  onPageChange = ({ selected }) => {
    const newQueryString = { ...this.props.queryString, page: selected + 1 };
    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    if (this.props.error) {
      return <ErrorMessage error={this.props.error} />;
    }

    if (!this.props.userPosts.docs) {
      return null;
    }

    const currentPage = parseInt(this.props.userPosts.page - 1, 10);

    const pagnite =
      this.props.userPosts.docs.length > 0 ? (
        <div className="nav justify-content-end">
          <CustomPaginate currentPage={currentPage} totalPage={this.props.userPosts.pages} onPageChange={this.onPageChange} />
        </div>
      ) : null;

    return (
      <div>
        <div className="user-info text-center">
          <div className="user-image">
            <Link to={`/user/${this.props.userInfo._id}`} className="d-inline-block">
              <LazyImage
                className="rounded-circle fb-avatar"
                src={`https://graph.facebook.com/${this.props.userInfo._id}/picture?width=128`}
                alt={this.props.userInfo.name}
                height="8rem"
                width="8rem"
              />
            </Link>
          </div>
          <div className="user-detail">
            <h3>
              <a href={`https://www.facebook.com/${this.props.userInfo._id}`}>{this.props.userInfo.name}</a>
            </h3>
            <h5>{this.props.userPosts.total} posts</h5>
          </div>
        </div>

        {pagnite}

        <div className="blog-main">{this.props.userPosts.docs && this.props.userPosts.docs.map(value => <PostContainer key={value._id} postId={value._id} post={value} />)}</div>

        {pagnite}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const parsed = url.parse(ownProps.location.search, true).query;
  if (!parsed.page) parsed.page = 1;
  if (!parsed.limit) parsed.limit = 10;

  return {
    queryString: parsed,
    userId: ownProps.match.params.user_id,
    userPosts: state.user.posts,
    userInfo: state.user.info,
    error: state.user.error
  };
};

export default connect(mapStateToProps, {
  fetchUserInfo: operations.fetchUserInfo,
  fetchUserPosts: operations.fetchUserPosts,
  push
})(User);
