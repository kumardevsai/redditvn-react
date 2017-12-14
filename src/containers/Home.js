import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { operations } from '../duck';
import ErrorMessage from '../components/ErrorMessage'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  onQueryChange = e => {
    this.setState({ query: e.target.value });
  };

  onClickRandomPost = e => {
    e.preventDefault();
    this.props.fetchRandomPostId(this.state.query);
  };

  onSubmitForm = e => {
    e.preventDefault();
    this.props.push(`/search?q=${encodeURIComponent(this.state.query)}`);
  };

  componentDidMount() {
    this.props.fetchInfo();
  }

  render() {
    if (this.props.error) {
      return <ErrorMessage error={this.props.error} />
    }

    return (
      <div className="starter-template">
        <form className="pt-5 pb-5" onSubmit={this.onSubmitForm}>
          <div className="form-group">
            <input id="searchBox"
              className="form-control form-control-lg"
              name="q"
              onChange={this.onQueryChange}
              value={this.state.query}
              placeholder="Search for posts (regex support)"
              aria-label="Search for posts (regex support)"
              type="text"
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary mr-2 mb-1" type="submit">
              Search
            </button>
            <input className="btn btn-secondary mb-1" name="action" value="Random Post" type="submit" onClick={this.onClickRandomPost} />
          </div>
        </form>
        <p className="lead pt-5">
          Chuyên trang tìm kiếm bài viết Reddit Vietnam
          <br /> Cảm ơn <code>{this.props.info.memberCount}</code> thành viên đã đóng góp <code>{this.props.info.postCount}</code> bài viết và <code>{this.props.info.commentCount}</code> bình luận.
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  info: state.home.info,
  error: state.home.error
});

export default connect(mapStateToProps, {
  fetchRandomPostId: operations.fetchRandomPostId,
  fetchInfo: operations.fetchInfo,
  push
})(Home);
