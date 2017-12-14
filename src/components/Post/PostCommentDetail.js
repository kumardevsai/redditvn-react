import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class PostCommentDetail extends PureComponent {
  static propTypes = {
    opId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired
  };

  static defaultProps = {
    opId: '0',
    comments: []
  };

  render() {
    const { opId, comments } = this.props;

    return (
      <div className="comment-content">
        {comments &&
          comments.map(comment => (
            <div key={comment._id}>
              <div className="row comment mb-2">
                <div className="col-auto pr-0">
                  <Link to={`/user/${comment.from.id}`}>
                    <LazyImage
                      className="rounded-circle fb-avatar"
                      src={`https://graph.facebook.com/${comment.from.id}/picture?width=32`}
                      alt={comment.from.name}
                      height="2rem"
                      width="2rem"
                    />
                  </Link>
                </div>
                <div className="col">
                  <span className="cmt-box brko">
                    <a className={classNames('mr-1', { 'redditvn-op': opId === comment.from.id })} href={`https://www.facebook.com/${comment.from.id}`}>
                      <span className="font-weight-bold">{comment.from.name}</span>
                    </a>
                    <span>{comment.message}</span>
                  </span>
                </div>
              </div>
              {/* for reply comment */}
              {comment.replies &&
                comment.replies.map(reply => (
                  <div className="reply-comment ml-3 ml-md-5" key={reply._id}>
                    <div className="row mb-2">
                      <div className="col-auto pr-0">
                        <Link to={`/user/${reply.from.id}`}>
                          <LazyImage
                            className="rounded-circle fb-avatar"
                            src={`https://graph.facebook.com/${reply.from.id}/picture?width=32`}
                            alt={reply.from.name}
                            height="1.25rem"
                            width="1.25rem"
                          />
                        </Link>
                      </div>
                      <div className="col">
                        <span className="cmt-box reply-box brko">
                          <a className={classNames('mr-1', { 'redditvn-op': opId === reply.from.id })} href={`https://www.facebook.com/${reply.from.id}`}>
                            <span className="font-weight-bold">{reply.from.name}</span>
                          </a>
                          <span>{reply.message}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    );
  }
}

export default PostCommentDetail;
