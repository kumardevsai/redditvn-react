import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import PostCommentDetail from './PostCommentDetail';
import PropTypes from 'prop-types';
import ErrorMessage from '../ErrorMessage';
import Spinner from 'react-spinkit';
import { getComments} from '../../utils/graphqlQuery';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import base64 from 'base-64';

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
    const hasNextPage = _.get(nextProps, 'data.node.comments.pageInfo.hasNextPage', undefined);
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
    const { postId, data: { fetchMore, node } } = this.props;

    const endCursor = _.get(node, 'comments.pageInfo.endCursor', undefined);

    fetchMore({
      query: getComments,
      variables: {
        post_id: base64.encode(`Post:${postId}`),
        cursor: endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        const newResult = {
          ...previousResult,
          node: {
            ...previousResult.node,
            comments: {
              edges: [...previousResult.node.comments.edges, ...fetchMoreResult.node.comments.edges],
              pageInfo: fetchMoreResult.node.comments.pageInfo
            }
          }
        };
        return newResult;
      }
    });
  };

  render() {
    const { opId, data: { loading, error, node } } = this.props;
    const { show_button_more } = this.state;

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <div className="card-body" id="comment">
        {node && node.comments && <PostCommentDetail opId={opId} comments={node.comments} />}
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
        post_id: base64.encode(`Post:${props.postId}`),
        cursor: null
      },
      notifyOnNetworkStatusChange: true
    })
  })
)(PostComment);
