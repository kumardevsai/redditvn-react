import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import querystring from 'querystring';
import url from 'url';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import { operations } from '../duck';
import Pagination from '../components/Pagination';

import { withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const getUsers = gql`
  query getUsers($query: String, $first: Int, $after: String, $last: Int, $before: String) {
    users(first: $first, after: $after, last: $last, before: $before, q: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
      }
      edges {
        cursor
        node {
          _id
          name
          profile_pic
          posts_count
          comments_count
        }
      }
    }
  }
`;

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      error: undefined
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.props.showLoading();
      this.setState({ loading: true });
      const { query } = this.props.client;

      try {
        const response = await query({
          query: getUsers,
          variables: {
            query: this.props.queryString.q,
            first: this.props.queryString.f,
            after: this.props.queryString.a,
            last: this.props.queryString.l,
            before: this.props.queryString.b
          }
        });

        const newResult = {
          ...this.state.data,
          users: response.data.users
        };

        this.setState({ data: newResult });
      } catch (error) {
        this.setState({ error: error });
      }

      this.props.hideLoading();
      this.setState({ loading: false });
    }
  }

  async componentDidMount() {
    this.props.showLoading();
    this.setState({ loading: true });

    const { query } = this.props.client;

    try {
      const response = await query({
        query: getUsers,
        variables: {
          query: this.props.queryString.q,
          first: this.props.queryString.f,
          after: this.props.queryString.a,
          last: this.props.queryString.l,
          before: this.props.queryString.b
        }
      });

      this.setState({ data: response.data });
    } catch (error) {
      this.setState({ error: error });
    }

    this.props.hideLoading();
    this.setState({ loading: false });
  }

  onClickNextPage = () => {
    const { users } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.a = users.pageInfo.endCursor;
    newQueryString.b = null;
    newQueryString.f = 100;
    newQueryString.l = null;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  onClickPreviousPage = () => {
    const { users } = this.state.data;
    const newQueryString = { ...this.props.queryString };
    newQueryString.a = null;
    newQueryString.b = users.pageInfo.startCursor;
    newQueryString.f = null;
    newQueryString.l = 100;

    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    const { loading, error, data: { users } } = this.state;

    if (loading) {
      return <Spinner name="three-bounce" />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <div>
        <div className="nav justify-content-end">
          <Pagination
            hasNextPage={users.pageInfo.hasNextPage}
            hasPreviousPage={users.pageInfo.hasPreviousPage}
            onClickNextPage={this.onClickNextPage}
            onClickPreviousPage={this.onClickPreviousPage}
          />
        </div>

        <div className="card mb-3">
          <h5 className="card-header">The ranking of {users.pageInfo.totalCount} RedditVN members</h5>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th className="text-center" scope="col">
                  Posts
                </th>
                <th className="text-center" scope="col">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody>
              {users.edges &&
                users.edges.map(value => (
                  <tr key={value.node._id}>
                    <td>
                      <Link to={`/user/${value.node._id}`} className="d-inline-block mr-2">
                        <LazyImage
                          className="rounded-circle fb-avatar"
                          src={`https://graph.facebook.com/${value.node._id}/picture?width=32`}
                          alt={value.node.name}
                          height="2rem"
                          width="2rem"
                        />
                      </Link>
                      <Link to={`/user/${value.node._id}`}>{value.node.name}</Link>
                    </td>
                    <td className="text-center">{value.node.posts_count}</td>
                    <td className="text-center">{value.node.comments_count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="nav justify-content-end">
          <Pagination
            hasNextPage={users.pageInfo.hasNextPage}
            hasPreviousPage={users.pageInfo.hasPreviousPage}
            onClickNextPage={this.onClickNextPage}
            onClickPreviousPage={this.onClickPreviousPage}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const query = url.parse(ownProps.location.search, true).query;
  query.q = query.q || null;
  query.a = query.a || null;
  query.b = query.b || null;
  query.f = query.f || 100;
  query.l = query.l || null;

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
)(Users);
