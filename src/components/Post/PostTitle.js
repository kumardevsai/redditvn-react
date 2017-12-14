import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

class PostTitle extends PureComponent {
  render() {
    return (
      <div className="card-header card-header-title">
        <h5 className="my-1">
          <Link to={`/post/${this.props.postId}`}>{this.props.title}</Link>
        </h5>
      </div>
    );
  }
}

export default PostTitle;
