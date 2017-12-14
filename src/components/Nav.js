import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import $ from 'jquery';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  onQueryChange = e => {
    this.setState({ query: e.target.value });
  };

  onSubmitForm = e => {
    e.preventDefault();
    this.props.push(`/search?q=${encodeURIComponent(this.state.query)}`);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      this.setState({ query: nextProps.query });
    }
  }

  componentDidMount() {
    $('.navbar').on('mouseenter mouseleave', '.dropdown', function (e) {
      var _d = $(e.target).closest('.dropdown'); _d.addClass('show');
      setTimeout(function () {
        _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
      }, 300);
    });
  }

  render() {
    const showSearchBar = this.props.pathname !== '/';

    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <NavLink exact to="/" className="navbar-brand">
          search.redditvn
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsDefault"
          aria-controls="navbarsDefault"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarsDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link">
                Home<span className="sr-only">(current)</span>
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink to="/stats" className="nav-link dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Stats
              </NavLink>
              <div className="dropdown-menu" aria-labelledby="dropdown01">
                <NavLink exact to="/stats" className="dropdown-item">
                  Statistics
                </NavLink>
                <NavLink exact to="/stats/top" className="dropdown-item">
                  Top 10
                </NavLink>
                <NavLink exact to="/stats/user" className="dropdown-item">
                  Top Posters
                </NavLink>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="dropdown-link"
                href="https://www.facebook.com/redditvietnam/"
                rel="noopener noreferrer"
                target="_blank"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                RedditVN
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdown-link">
                <a className="dropdown-item" href="https://www.facebook.com/redditvietnam/" target="_blank" rel="noopener noreferrer">
                  Fan Page
                </a>
                <a className="dropdown-item" href="https://www.facebook.com/groups/redditvietnam/" target="_blank" rel="noopener noreferrer">
                  Group
                </a>
                <a className="dropdown-item" href="https://www.reddit.com/r/RedditVN/" target="_blank" rel="noopener noreferrer">
                  r/RedditVN
                </a>
              </div>
            </li>
          </ul>
          {showSearchBar && (<form className="form-inline my-lg-0" onSubmit={this.onSubmitForm} target="_top">
            <input className="form-control mr-sm-2" name="q" type="text"
              onChange={this.onQueryChange}
              placeholder="Search (regex support)" aria-label="Search (regex support)" value={this.state.query} />
            <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
          </form>)}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  pathname: ownProps.location.pathname,
  query: state.search.query
});

export default withRouter(connect(mapStateToProps, {
  push
})(Nav));
