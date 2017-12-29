import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import PostCommentDetail from './PostCommentDetail';
import PropTypes from 'prop-types';
import ErrorMessage from '../ErrorMessage';
import Spinner from 'react-spinkit';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

const getComments = gql`
  query getComments($post_id: String!, $cursor: String) {
    post(id: $post_id) {
      _id
      comments(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
        }
        edges {
          cursor
          node {
            _id
            message
            created_time
            user {
              _id
              name
              profile_pic
            }
            replies {
              edges {
                node {
                  _id
                  message
                  created_time
                  user {
                    _id
                    name
                    profile_pic
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

class PostComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_button_more: true
    };
  }

  static propTypes = {
    postId: PropTypes.string.isRequired,
    opId: PropTypes.string.isRequired
  };

  static defaultProps = {
    postId: '0',
    opId: '0'
  };

  componentWillReceiveProps(nextProps) {
    const hasNextPage = _.get(nextProps, 'data.post.comments.pageInfo.hasNextPage', undefined);
    if (hasNextPage === false) {
      this.setState({ show_button_more: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  onClickShowComments = () => {
    const { postId, data: { fetchMore, post } } = this.props;

    const endCursor = _.get(post, 'comments.pageInfo.endCursor', undefined);

    fetchMore({
      query: getComments,
      variables: {
        post_id: postId,
        cursor: endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        const edges = [...previousResult.post.comments.edges, ...fetchMoreResult.post.comments.edges];
        const newResult = {
          ...previousResult,
          post: {
            ...previousResult.post,
            comments: {
              edges: edges,
              pageInfo: fetchMoreResult.post.comments.pageInfo
            }
          }
        };
        return newResult;
      }
    });
  };

  render() {
    const { opId, data: { loading, error, post } } = this.props;
    const { show_button_more } = this.state;

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <div className="card-body" id="comment">
        {post && post.comments && <PostCommentDetail opId={opId} comments={post.comments} />}
        {loading ? (
          <Spinner name="three-bounce" />
        ) : (
          show_button_more && (
            <button type="button" className="btn btn-primary" onClick={this.onClickShowComments}>
              Show more comments
            </button>
          )
        )}
      </div>
    );
  }
}

export default compose(
  graphql(getComments, {
    options: props => ({
      variables: {
        post_id: props.postId,
        cursor: null
      },
      notifyOnNetworkStatusChange: true
    })
  })
)(PostComment);
