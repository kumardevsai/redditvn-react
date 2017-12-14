import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class PostInfo extends PureComponent {
  static propTypes = {
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    showDetail: PropTypes.bool.isRequired,
    postId: PropTypes.string.isRequired,
    isDeleted: PropTypes.bool.isRequired
  };

  static defaultProps = {
    likesCount: 0,
    commentsCount: 0,
    showDetail: false,
    postId: '0',
    isDeleted: false
  };

  render() {
    const { likesCount, commentsCount, showDetail, postId, isDeleted } = this.props;

    return (
      <div className="card-body">
        {likesCount > 0 && <span className="badge badge-pill badge-primary mr-1">{likesCount} likes</span>}
        {commentsCount > 0 && showDetail ? (
          <a className="badge badge-pill badge-secondary mr-1" href={`#comment`}>
            {commentsCount} comments
          </a>
        ) : (
          <Link className="badge badge-pill badge-secondary mr-1" to={`/post/${postId}#comment`}>
            {commentsCount} comments
          </Link>
        )}
        {isDeleted ? (
          <span className="badge badge-pill badge-danger mr-1">Deleted</span>
        ) : (
          <a className="badge badge-pill badge-info mr-1" href={`https://www.facebook.com/${postId}`}>
            Read on Facebook
          </a>
        )}
      </div>
    );
  }
}

export default PostInfo;
