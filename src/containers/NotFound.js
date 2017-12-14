import React, { Component } from 'react';
import ErrorMessage from '../components/ErrorMessage';

class NotFound extends Component {
  render() {
    const error = new Error();
    error.status = 404;
    error.title = 'page not found';
    error.message = 'the page you requested does not exist';
    return <ErrorMessage error={error} />;
  }
}

export default NotFound;
