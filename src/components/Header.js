import React, { Component } from 'react';
import Nav from './Nav';
import { withRouter } from 'react-router-dom';

class Header extends Component {
  render() {
    return <Nav />;
  }
}

export default withRouter(Header);
