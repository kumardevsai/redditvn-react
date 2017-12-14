import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Statistics from '../components/Stats/Statistics';
import Top from '../components/Stats/Top';
import User from '../components/Stats/User';
import ErrorMessage from '../components/ErrorMessage';
import { connect } from 'react-redux';

class Stats extends Component {
  render() {
    if (this.props.error) {
      return <ErrorMessage error={this.props.error} />;
    }

    return (
      <Switch>
        <Route exact path={`${this.props.match.path}/top`} component={Top} />
        <Route exact path={`${this.props.match.path}/user`} component={User} />
        <Route path={`${this.props.match.path}/`} component={Statistics} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  error: state.stats.error
});

export default withRouter(connect(mapStateToProps)(Stats));
