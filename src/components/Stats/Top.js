import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LazyImage from '../LazyImage';
import url from 'url';
import deepEqual from 'deep-equal';
import { push } from 'react-router-redux';
import moment from 'moment';
import { operations } from '../../duck';
import querystring from 'querystring';
import ErrorMessage from '../../components/ErrorMessage';
import Spinner from 'react-spinkit';
import { getTop } from '../../utils/graphqlQuery';
import { withApollo, compose } from 'react-apollo';

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.queryString.limit,
      group: props.queryString.group,
      data: {},
      loading: true,
      error: undefined
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
    const newQueryString = {
      ...this.props.queryString,
      limit: this.state.limit,
      group: this.state.group
    };
    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.queryString.limit !== nextProps.queryString.limit) {
      this.setState({ limit: nextProps.queryString.limit });
    }

    if (this.props.queryString.group !== nextProps.queryString.group) {
      this.setState({ group: nextProps.queryString.group });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.fetchTop();
    }
  }

  componentDidMount() {
    this.fetchTop();
  }

  fetchTop = async () => {
    let time = moment();
    switch (this.props.queryString.group) {
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

    this.props.showLoading();
    this.setState({ loading: true });

    const { query } = this.props.client;

    try {
      const response = await query({
        query: getTop,
        variables: {
          first: this.props.queryString.limit,
          since: since,
          until: until
        }
      });

      const newResult = {
        ...this.state.data,
        top: response.data.top,
        likes: response.data.likes,
        comments: response.data.comments
      };

      this.setState({ data: newResult });
    } catch (error) {
      this.setState({ error: error });
    }

    this.props.hideLoading();
    this.setState({ loading: false });
  };

  render() {
    const { loading, error, data: { top, likes, comments } } = this.state;

    if (loading) {
      return <Spinner name="three-bounce" />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!top) {
      return null;
    }

    const { posts_count } = top;

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
                {posts_count &&
                  posts_count.edges.map(value => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value.node._id}>
                      <div>
                        <Link to={`/user/${value.node._id}`} className="d-inline-block mr-2">
                          <LazyImage
                            className="mr-2 rounded-circle fb-avatar"
                            src={value.node.profile_pic}
                            alt={value.node.name}
                            height="1.5rem"
                            width="1.5rem"
                          />
                        </Link>
                        <Link to={`/user/${value.node._id}`}>{value.node.name}</Link>
                      </div>
                      <Link className="badge badge-primary badge-pill" to={`/user/${value.node._id}`}>
                        {value.node.posts_count}
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
                {likes &&
                  likes.edges.map(value => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value.node._id}>
                      <div>
                        <Link to={`/user/${value.node.user._id}`} className="d-inline-block mr-2">
                          <LazyImage
                            className="rounded-circle fb-avatar"
                            src={value.node.user.profile_pic}
                            alt={value.node.user.name}
                            height="1.5rem"
                            width="1.5rem"
                          />
                        </Link>
                        <Link to={`/post/${value.node._id}`}>{value.node.user.name}</Link>
                      </div>
                      <Link className="badge badge-primary badge-pill" to={`/post/${value.node._id}`}>
                        {value.node.likes_count}
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
                {comments &&
                  comments.edges.map(value => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value.node._id}>
                      <div>
                        <Link to={`/user/${value.node.user._id}`} className="d-inline-block mr-2">
                          <LazyImage
                            className="mr-2 rounded-circle fb-avatar"
                            src={value.node.user.profile_pic}
                            alt={value.node.user.name}
                            height="1.5rem"
                            width="1.5rem"
                          />
                        </Link>
                        <Link to={`/post/${value.node._id}`}>{value.node.user.name}</Link>
                      </div>
                      <Link className="badge badge-primary badge-pill" to={`/post/${value.node._id}`}>
                        {value.node.comments_count}
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
  const query = url.parse(ownProps.location.search, true).query;
  query.limit = query.limit || '10';
  query.group = query.group || 'today';

  return {
    queryString: query
  };
};

export default compose(
  connect(mapStateToProps, {
    push,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  }),
  withApollo
)(Top);
