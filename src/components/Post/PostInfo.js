import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

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

  onClickSubReddit = () => {
    ReactGA.event({ category: 'User', action: 'Button SubReddit in Post' });
  };

  onClickUserReddit = () => {
    ReactGA.event({ category: 'User', action: 'Button UserReddit in Post' });
  };

  onClickReadOnFacebook = () => {
    ReactGA.event({ category: 'User', action: 'Button Read on Facebook' });
  };

  render() {
    const { r, u, likesCount, commentsCount, showDetail, postId, isDeleted } = this.props;

    return (
      <div className="card-body">
        {r && (
          <Link className="badge badge-pill badge-primary mr-1" to={`/r/${r}`} onClick={this.onClickSubReddit}>
            r/{r}
          </Link>
        )}
        {u && (
          <Link className="badge badge-pill badge-primary mr-1" to={`/u/${u}`} onClick={this.onClickUserReddit}>
            u/{u}
          </Link>
        )}
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
          <a className="badge badge-pill badge-info mr-1" href={`https://www.facebook.com/${postId}`} onClick={this.onClickReadOnFacebook}>
            Read on Facebook
          </a>
        )}
      </div>
    );
  }
}

export default PostInfo;
