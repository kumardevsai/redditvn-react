import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';
import PropTypes from 'prop-types';

class PostAuthor extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    createdTime: PropTypes.string.isRequired
  };

  static defaultProps = {
    user: {},
    createdTime: new Date().toLocaleString()
  };

  render() {
    const { user, createdTime } = this.props;

    return (
      <header className="card-header card-header-post">
        <div className="row">
          <div className="col-auto align-self-center pr-0">
            <Link to={`/user/${user.raw_id}`} className="d-inline-block">
              <LazyImage className="rounded-circle fb-avatar" src={user.profile_pic} alt={user.name} height="2.5rem" width="2.5rem" />
            </Link>
          </div>
          <div className="col">
            <div className="user-name">
              <Link to={`/user/${user.raw_id}`}>
                <b>{user.name}</b>
              </Link>
            </div>
            <div>
              <small>
                <time>{new Date(createdTime).toLocaleString()}</time>
              </small>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default PostAuthor;
