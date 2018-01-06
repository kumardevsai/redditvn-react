import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from '../stores';

import 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js'; // This bundle includes popper
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import ScrollToTop from './ScrollToTop';
import Layout from './Layout';
import Home from './Home';
import Search from './Search';
import Post from './Post';
import User from './User';
import Users from './Users';
import Stats from './Stats';
import SubReddit from './SubReddit';
import UserReddit from './UserReddit';
import NotFound from './NotFound';

import { ApolloProvider } from 'react-apollo';
import client from '../graphqlClient';
import ReactGA from 'react-ga';
import Analytics from './Analytics';

ReactGA.initialize('UA-112002732-1');

const AnalyticsTracker = () => {
  return <Route component={Analytics} />;
};

class App extends Component {
  componentDidMount() {
    const ele = document.getElementById('ipl-progress-indicator');
    if (ele) {
      setTimeout(() => {
        ele.classList.add('available');
        setTimeout(() => {
          ele.outerHTML = '';
        }, 250);
      }, 250);
    }
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Layout>
              <ScrollToTop />
              <AnalyticsTracker />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/r/:subreddit" component={SubReddit} />
                <Route exact path="/u/:ureddit" component={UserReddit} />
                <Route exact path="/post/:post_id" component={Post} />
                <Route exact path="/user/:user_id" component={User} />
                <Route path="/stats" component={Stats} />
                <Route path="/users" component={Users} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          </ConnectedRouter>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
