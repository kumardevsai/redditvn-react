import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class PostTitle extends PureComponent {
  static propTypes = {
    postId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    postId: '0',
    title: ''
  };

  render() {
    const { postId, title } = this.props;

    return (
      <div className="card-header card-header-title">
        <h5 className="my-1">
          <Link to={`/post/${postId}`}>{title}</Link>
        </h5>
      </div>
    );
  }
}

export default PostTitle;
