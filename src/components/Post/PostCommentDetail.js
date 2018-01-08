import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class PostCommentDetail extends PureComponent {
  static propTypes = {
    opId: PropTypes.string,
    comments: PropTypes.object.isRequired
  };

  static defaultProps = {
    opId: '0',
    comments: {}
  };

  render() {
    const { opId, comments } = this.props;

    return (
      <div className="comment-content">
        {comments && comments.edges &&
          comments.edges.map(commentEdge => (
            <div key={commentEdge.node.raw_id}>
              <div className="row comment mb-2">
                <div className="col-auto pr-0">
                  <Link to={`/user/${commentEdge.node.user.raw_id}`}>
                    <LazyImage
                      className="rounded-circle fb-avatar"
                      src={commentEdge.node.user.profile_pic}
                      alt={commentEdge.node.user.name}
                      height="2rem"
                      width="2rem"
                    />
                  </Link>
                </div>
                <div className="col">
                  <span className="cmt-box brko">
                    <Link className={classNames('mr-1', { 'redditvn-op': opId === commentEdge.node.user.raw_id })} to={`/user/${commentEdge.node.user.raw_id}`}>
                      <span className="font-weight-bold">{commentEdge.node.user.name}</span>
                    </Link>
                    <span>{commentEdge.node.message}</span>
                  </span>
                </div>
              </div>
              {/* for reply comment */}
              {commentEdge.node.replies && commentEdge.node.replies.edges &&
                commentEdge.node.replies.edges.map(replyEdge => (
                  <div className="reply-comment ml-3 ml-md-5" key={replyEdge.node.raw_id}>
                    <div className="row mb-2">
                      <div className="col-auto pr-0">
                        <Link to={`/user/${replyEdge.node.user.raw_id}`}>
                          <LazyImage
                            className="rounded-circle fb-avatar"
                            src={replyEdge.node.user.profile_pic}
                            alt={replyEdge.node.user.name}
                            height="1.25rem"
                            width="1.25rem"
                          />
                        </Link>
                      </div>
                      <div className="col">
                        <span className="cmt-box reply-box brko">
                          <Link className={classNames('mr-1', { 'redditvn-op': opId === replyEdge.node.user.raw_id })} to={`/user/${replyEdge.node.user.raw_id}`}>
                            <span className="font-weight-bold">{replyEdge.node.user.name}</span>
                          </Link>
                          <span>{replyEdge.node.message}</span>
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
