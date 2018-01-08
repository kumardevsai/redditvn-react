import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

class PostNavigation extends PureComponent {
  static propTypes = {
    prevPost: PropTypes.object.isRequired,
    nextPost: PropTypes.object.isRequired
  };

  static defaultProps = {
    prevPost: undefined,
    nextPost: undefined
  };

  onClickNextPost = () => {
    ReactGA.event({ category: 'User', action: 'Button Next Post' });
  };

  onClickPreviousPost = () => {
    ReactGA.event({ category: 'User', action: 'Button Previous Post' });
  };

  render() {
    const { prevPost, nextPost } = this.props;

    return (
      <aside className="card-body">
        <div className="row">
          {prevPost && (
            <div className="col">
              <Link className="badge badge-pill badge-secondary mr-1" to={`/post/${prevPost.raw_id}`} onClick={this.onClickPreviousPost}>
                « Prev post
              </Link>
            </div>
          )}
          {nextPost && (
            <div className="col text-right">
              <Link className="badge badge-pill badge-secondary mr-1" to={`/post/${nextPost.raw_id}`} onClick={this.onClickNextPost}>
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
