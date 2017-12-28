import React, { Component } from 'react';
import PostContainer from '../components/Post/PostContainer';
import { connect } from 'react-redux';
import ErrorMessage from '../components/ErrorMessage';

import { graphql, withApollo, compose } from 'react-apollo';
import base64 from 'base-64';
import gql from 'graphql-tag';
import _ from 'lodash';

const getPost = gql`
  query getPost($post_id: String!, $cursor: Cursor, $first: Int) {
    post(id: $post_id) {
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
      attachments {
        edges {
          node {
            url
            src
            type
          }
        }
      }
    }
    prevPost: posts(first: 1, after: $cursor) {
      edges {
        node {
          _id
        }
      }
    }
    nextPost: posts(first: $first, last: 1, before: $cursor) {
      edges {
        node {
          _id
        }
      }
    }
  }
`;
class Post extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.postId !== nextProps.postId) {
      this.props.data.refetch({
        post_id: nextProps.postId,
        cursor: base64.encode(nextProps.postId),
        first: null
      });
    }
  }

  render() {
    const { data, data: { loading, error } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!data.post) {
      return <p>Not found post</p>;
    }

    const prevPost = _.get(data, 'prevPost.edges[0].node', undefined);
    const nextPost = _.get(data, 'nextPost.edges[0].node', undefined);

    return (
      <PostContainer
        postId={data.post._id}
        data={{
          post: data.post,
          prevPost: prevPost,
          nextPost: nextPost
        }}
        showDetail={true}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  postId: ownProps.match.params.post_id
});

export default compose(
  connect(mapStateToProps, {}),
  withApollo,
  graphql(getPost, {
    options: props => ({
      variables: {
        post_id: props.postId,
        cursor: base64.encode(props.postId),
        first: null
      }
    })
  })
)(Post);
