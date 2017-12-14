import React, { Component } from 'react';
import PostContainer from '../components/Post/PostContainer';
import { connect } from 'react-redux';
import { operations } from '../duck';
import ErrorMessage from '../components/ErrorMessage'

class Post extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.postId !== nextProps.postId) {
      this.props.fetchPostById(nextProps.postId);
    }
  }

  componentDidMount() {
    this.props.fetchPostById(this.props.postId);
  }

  render() {
    if (this.props.error) {
      return <ErrorMessage error={this.props.error} />
    }

    return <PostContainer postId={this.props.postId} post={this.props.detail} images={this.props.images} comments={this.props.comments} showDetail={true} />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  postId: ownProps.match.params.post_id,
  detail: state.post.detail,
  images: state.post.images,
  comments: state.post.comments,
  error: state.post.error
});

export default connect(mapStateToProps, {
  fetchPostById: operations.fetchPostById
})(Post);
