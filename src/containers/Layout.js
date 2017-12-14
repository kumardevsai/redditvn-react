import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Layout extends Component {
  static propTypes = {
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    isLoading: false
  };

  render() {
    return (
      <div className="react-layout">
        <Header />
        <div className="container" role="main">
          {this.props.children}
        </div>
        <Footer />
        {this.props.isLoading && <div className="loading">Loading&#8230;</div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.main.isLoading
});

export default withRouter(connect(mapStateToProps)(Layout));
