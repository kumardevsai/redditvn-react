import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';
import PropTypes from 'prop-types';

class PostAuthor extends PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    }).isRequired,
    createdTime: PropTypes.string.isRequired
  };

  static defaultProps = {
    user: {
      id: '0',
      name: 'user'
    },
    createdTime: new Date().toLocaleString()
  };

  render() {
    const { user, createdTime } = this.props;

    return (
      <header className="card-header card-header-post">
        <div className="row">
          <div className="col-auto align-self-center pr-0">
            <Link to={`/user/${user.id}`} className="d-inline-block">
              <LazyImage className="rounded-circle fb-avatar" src={`https://graph.facebook.com/${user.id}/picture?width=40`} alt={user.name} height="2.5rem" width="2.5rem" />
            </Link>
          </div>
          <div className="col">
            <div className="user-name">
              <a href={`https://www.facebook.com/${user.id}`}>
                <b>{user.name}</b>
              </a>
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
