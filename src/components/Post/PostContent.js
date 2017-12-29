import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import { connect } from 'react-redux';
import Mark from 'mark.js';
import PropTypes from 'prop-types';

// break line and add br tag
const regexBreakLine = /(?:\r\n|\r|\n)/g;
// auto generate a tag for link
const regexAutoLink = /(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#=./\-?_]+)/gi;
const regexAutoCustomLink = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(?![^<]*>|[^<>]*<\/)((redd.it|reddit.com|fb.com|facebook.com|redditvn.com)\/[a-z0-9&#=./\-?_]+)/gi;
// not highlight reddit link when it inside a tag
const regexAutoRedditLink = /(?!<a[^>]*?>)([ru]\/[a-z0-9\-_]+)(?![^<]*?<\/a>)/gi;

class PostContent extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired
  };

  static defaultProps = {
    content: ''
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateContent();
  }

  componentDidMount() {
    this.updateContent();
  }

  updateContent = () => {
    const { content } = this.props;

    let editContent = content || '';
    editContent = editContent.replace(regexBreakLine, '<br />');
    editContent = editContent.replace(regexAutoLink, '<a href="$1" target="_blank">$1</a>');
    editContent = editContent.replace(regexAutoCustomLink, function(match, p0, p1, offset, string){
      // If match domain with autolink but without https:// prefix
      // == null => both null or undefined
      const prefix = (p0 == null) ? 'https://' : '';
      return '<a href="' + prefix + p1 + '" target="_blank">' + prefix + p1 + '</a>';
    });

    editContent = editContent.replace(regexAutoRedditLink, function(match, p1, offset, string) {
      const className = p1[0].toLowerCase() === 'r' ? 'redditvn-sub' : 'redditvn-user';
      return '<a class="' + className + '" href="https://reddit.com/' + p1 + '" target="_blank">' + p1 + '</a>';
    });

    this.refs.blogPostContainer.innerHTML = editContent;
    if (this.props.query) {
      if (this.props.query.startsWith('regex:')) {
        const regexString = this.props.query.substr(6);
        const reg = new RegExp(regexString, 'gim');
        new Mark(this.refs.blogPostContainer).markRegExp(reg);
      } else {
        new Mark(this.refs.blogPostContainer).mark(this.props.query, { separateWordSearch: false });
      }
    }
  };

  render() {
    return <section className="card-body blog-post-content" ref="blogPostContainer" />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  query: state.search.query
});

export default connect(mapStateToProps)(PostContent);
