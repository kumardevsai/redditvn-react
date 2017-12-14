import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class PostNavigation extends PureComponent {
  static propTypes = {
    prevPost: PropTypes.object.isRequired,
    nextPost: PropTypes.object.isRequired
  };

  static defaultProps = {
    prevPost: undefined,
    nextPost: undefined
  };

  render() {
    const { prevPost, nextPost } = this.props;

    return (
      <aside className="card-body">
        <div className="row">
          {prevPost && (
            <div className="col">
              <Link className="badge badge-pill badge-secondary mr-1" to={`/post/${prevPost._id}`}>
                « Prev post
              </Link>
            </div>
          )}
          {nextPost && (
            <div className="col text-right">
              <Link className="badge badge-pill badge-secondary mr-1" to={`/post/${nextPost._id}`}>
                Next post »
              </Link>
            </div>
          )}
        </div>
      </aside>
    );
  }
}

export default PostNavigation;
