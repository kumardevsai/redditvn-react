import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { operations } from '../../duck';
import { connect } from 'react-redux';
import LazyImage from '../LazyImage';
import url from 'url';
import deepEqual from 'deep-equal';
import { push } from 'react-router-redux';
import moment from 'moment';

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      group: props.group
    };
  }

  onLimitChange = e => {
    this.setState({ limit: e.target.value });
  };

  onGroupChange = e => {
    this.setState({ group: e.target.value });
  };

  onSubmitForm = e => {
    e.preventDefault();
    this.props.push(`/stats/top/?limit=${this.state.limit}&group=${this.state.group}`);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.limit !== nextProps.limit) {
      this.setState({ limit: nextProps.limit });
    }

    if (this.props.group !== nextProps.group) {
      this.setState({ group: nextProps.group });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) === true && deepEqual(this.state, nextState) === true) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.limit, prevProps.limit) === false) {
      this.fetchTopStats();
    } else if (deepEqual(this.props.group, prevProps.group) === false) {
      this.fetchTopStats();
    }
  }

  componentDidMount() {
    this.fetchTopStats();
  }

  fetchTopStats = () => {
    let time = moment();
    switch (this.props.group) {
      case 'today':
        time = time.startOf('day');
        break;
      case '7days':
        time = time.add(-7, 'day');
        break;
      case '30days':
        time = time.add(-30, 'day');
        break;
      default:
        time = moment(0);
        break;
    }

    const since = time.unix();
    const until = moment().unix();

    this.props.fetchTop(this.props.limit, since, until);
  };

  render() {
    const { top } = this.props;

    return (
      <div>
        <form className="mb-3" onSubmit={this.onSubmitForm}>
          <div className="form-row">
            <div className="col form-group">
              <select className="form-control" id="input-type" name="limit" value={this.state.limit} onChange={this.onLimitChange}>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="30">Top 30</option>
              </select>
            </div>
            <div className="col form-group">
              <select className="form-control" id="input-group" name="group" value={this.state.group} onChange={this.onGroupChange}>
                <option value="today">Today</option>
                <option value="7days">7 days</option>
                <option value="30days">30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Show
          </button>
        </form>
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card">
              <h5 className="card-header">
                <Link to="/stats/user">Top posters</Link>
              </h5>
              <ul className="list-group list-group-flush">
                {top.top_users &&
                  top.top_users.map(value => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value._id}>
                      <div>
                        <Link to={`/user/${value._id}`} className="d-inline-block mr-2">
                          <LazyImage
                            className="mr-2 rounded-circle fb-avatar"
                            src={`https://graph.facebook.com/${value._id}/picture?width=24`}
                            alt={value.name}
                            height="1.5rem"
                            width="1.5rem"
                          />
                        </Link>
                        <a href={`https://www.facebook.com/${value._id}`}>{value.name}</a>
                      </div>
                      <Link className="badge badge-primary badge-pill" to={`/user/${value._id}`}>
                        {value.post_count}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card">
              <h5 className="card-header">Most liked posts</h5>
              <ul className="list-group list-group-flush">
                {top.top_likes &&
                  top.top_likes.map(value => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value._id}>
                      <div>
                        <Link to={`/user/${value.from.id}`} className="d-inline-block mr-2">
                          <LazyImage
                            className="rounded-circle fb-avatar"
                            src={`https://graph.facebook.com/${value.from.id}/picture?width=24`}
                            alt={value.from.name}
                            height="1.5rem"
                            width="1.5rem"
                          />
                        </Link>
                        <a href={`https://www.facebook.com/${value._id}`}>{value.from.name}</a>
                      </div>
                      <Link className="badge badge-primary badge-pill" to={`/post/${value._id}`}>
                        {value.likes_count}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card">
              <h5 className="card-header">Most commented posts</h5>
              <ul className="list-group list-group-flush">
                {top.top_comments &&
                  top.top_comments.map(value => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value._id}>
                      <div>
                        <Link to={`/user/${value.from.id}`} className="d-inline-block mr-2">
                          <LazyImage
                            className="mr-2 rounded-circle fb-avatar"
                            src={`https://graph.facebook.com/${value.from.id}/picture?width=24`}
                            alt={value.from.name}
                            height="1.5rem"
                            width="1.5rem"
                          />
                        </Link>
                        <a href={`https://www.facebook.com/${value._id}`}>{value.from.name}</a>
                      </div>
                      <Link className="badge badge-primary badge-pill" to={`/post/${value._id}`}>
                        {value.comments_count}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const parsed = url.parse(ownProps.location.search, true).query;

  return {
    limit: parsed.limit || '10',
    group: parsed.group || 'today',
    top: state.stats.top
  };
};

export default connect(mapStateToProps, {
  fetchTop: operations.fetchTop,
  push
})(Top);
