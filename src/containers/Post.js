import React, { Component } from 'react';
import PostContainer from '../components/Post/PostContainer';
import { connect } from 'react-redux';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import { getPost} from '../utils/graphqlQuery';
import { graphql, compose } from 'react-apollo';
import base64 from 'base-64';
import _ from 'lodash';

class Post extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.postId !== nextProps.postId) {
      this.props.data.refetch({
        post_id: nextProps.postId,
        cursor: base64.encode(`{"lastId":"${nextProps.postId}"}`)
      });
    }
  }

  render() {
    const { data, data: { loading, error } } = this.props;

    if (loading) {
      return <Spinner name='three-bounce' />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!data.post) {
      return <ErrorMessage error={new Error('No post found.')} />;
    }

    const prevPost = _.get(data, 'prevPost.edges[0].node', undefined);
    const nextPost = _.get(data, 'nextPost.edges[0].node', undefined);

    return (
      <PostContainer
        postId={data.post._id}
        post={data.post}
        nextPost={prevPost}
        prevPost={nextPost}
        showDetail={true}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  postId: ownProps.match.params.post_id
});

export default compose(
  connect(mapStateToProps),
  graphql(getPost, {
    options: props => ({
      variables: {
        post_id: base64.encode(`Post:${props.postId}`),
        cursor: base64.encode(`{"id":"${props.postId}"}`)
      }
    })
  })
)(Post);
