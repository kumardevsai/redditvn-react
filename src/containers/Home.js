import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { operations } from '../duck';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from 'react-spinkit';
import { getCount, getRandom } from '../utils/graphqlQuery';
import { graphql, withApollo, compose } from 'react-apollo';
import $ from 'jquery';
import ReactGA from 'react-ga';

const defaultSubReddit = 'All SubReddit';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      subreddit: defaultSubReddit
    };
  }

  onQueryChange = e => {
    this.setState({ query: e.target.value });
  };

  onSubRedditChange = e => {
    this.setState({ subreddit: e.target.value });
  };

  onClickRandomPost = async e => {
    e.preventDefault();
    ReactGA.event({ category: 'User', action: 'Button Random' });
    this.props.showLoading();

    const { query } = this.props.client;
    try {
      const r = this.state.subreddit !== defaultSubReddit ? this.state.subreddit : '';
      const response = await query({
        query: getRandom,
        variables: {
          q: this.state.query,
          r: r
        },
        fetchPolicy: 'network-only'
      });
      this.props.hideLoading();
      this.props.push(`/post/${response.data.random._id}`);
    } catch (error) {
      console.log('ERROR: random', error);
      this.props.hideLoading();
    }
  };

  onSubmitForm = e => {
    e.preventDefault();
    ReactGA.event({ category: 'User', action: 'Button Search Home' });
    const r = this.state.subreddit !== defaultSubReddit ? this.state.subreddit : '';
    if (r) {
      this.props.push(`/r/${r}?q=${encodeURIComponent(this.state.query)}`);
    } else {
      this.props.push(`/search?q=${encodeURIComponent(this.state.query)}`);
    }
  };

  componentDidMount() {
    let self = this;
    $(function() {
      $('.input-group').on('click', '.dropdown-menu li', function() {
        const r = $(this).attr('data-value');
        $(this)
          .closest('.dropdown')
          .find('input.subreddit-id')
          .val(r);
        self.setState({ subreddit: r });
      });
    });
  }

  render() {
    const { data, data: { loading, error } } = this.props;

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <div className="starter-template">
        <form className="pt-5 pb-5" onSubmit={this.onSubmitForm}>
          <div className="form-group row">
            <div className="col-12 col-md-8 col-lg-9 mb-2 mb-md-0">
              <input
                id="searchBox"
                className="form-control form-control-lg"
                name="q"
                onChange={this.onQueryChange}
                value={this.state.query}
                placeholder="Search for posts (regex support)"
                aria-label="Search for posts (regex support)"
                type="text"
              />
            </div>
            <div className="input-group dropdown col-12 col-md-4 col-lg-3">
              <input type="text" className="form-control subreddit-id dropdown-toggle" onChange={this.onSubRedditChange} value={this.state.subreddit} />
              <ul className="dropdown-menu dropdown-menu-right dropdown-menu-subreddit">
                {data.subreddits &&
                  data.subreddits.edges.map(value => (
                    <li key={value.node._id} className="dropdown-item" data-value={value.node._id}>
                      {value.node._id}
                    </li>
                  ))}
              </ul>
              <span role="button" className="input-group-addon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
            </div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary mr-2 mb-1" type="submit">
              Search
            </button>
            <input className="btn btn-secondary mb-1" name="action" value="Random Post" type="submit" onClick={this.onClickRandomPost} />
          </div>
        </form>
        {loading ? (
          <Spinner name="three-bounce" />
        ) : (
          <p className="lead pt-5">
            Chuyên trang tìm kiếm bài viết Reddit Vietnam
            <br /> Cảm ơn <code>{data.usersCount}</code> thành viên đã đóng góp <code>{data.postsCount}</code> bài viết và <code>{data.commentsCount}</code> bình luận.
          </p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({});

export default compose(
  withApollo,
  graphql(getCount),
  connect(mapStateToProps, {
    fetchRandomPostId: operations.fetchRandomPostId,
    push,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  })
)(Home);
