import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import querystring from 'querystring';
import url from 'url';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { operations } from '../../duck';
import CustomPaginate from '../CustomPaginate';
import LazyImage from '../LazyImage';

class User extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) === true) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.fetchNewUserList();
    }
  }

  componentDidMount() {
    this.fetchNewUserList();
  }

  fetchNewUserList = () => {
    this.props.fetchUserList(this.props.queryString.page, this.props.queryString.limit);
  };

  onPageChange = ({ selected }) => {
    const newQueryString = { ...this.props.queryString, page: selected + 1 };
    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  render() {
    const currentPage = parseInt(this.props.users.page - 1, 10);
    const beginCount = currentPage * this.props.users.limit + 1;

    const pagnite = (
      <div className="nav justify-content-end">
        <CustomPaginate currentPage={currentPage} totalPage={this.props.users.pages} onPageChange={this.onPageChange} />
      </div>
    );

    return (
      <div>
        {pagnite}

        <div className="card mb-3">
          <h5 className="card-header">The ranking of {this.props.users.total} RedditVN members</h5>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  #
                </th>
                <th scope="col">Name</th>
                <th className="text-center" scope="col">
                  Posts
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.users.docs &&
                this.props.users.docs.map((value, index) => (
                  <tr key={value._id}>
                    <th className="text-center" scope="row">
                      {beginCount + index}
                    </th>
                    <td>
                      <Link to={`/user/${value._id}`} className="d-inline-block mr-2">
                        <LazyImage
                          className="rounded-circle fb-avatar"
                          src={`https://graph.facebook.com/${value._id}/picture?width=32`}
                          alt={value.name}
                          height="2rem"
                          width="2rem"
                        />
                      </Link>
                      <a href={`https://www.facebook.com/${value._id}`}>{value.name}</a>
                    </td>
                    <td className="text-center">
                      <Link to={`/user/${value._id}`}>{value.post_count}</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {pagnite}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const parsed = url.parse(ownProps.location.search, true).query;
  if (!parsed.page) parsed.page = 1;
  if (!parsed.limit) parsed.limit = 25;

  return {
    queryString: parsed,
    users: state.stats.users
  };
};

export default connect(mapStateToProps, {
  fetchUserList: operations.fetchUserList,
  push
})(User);
