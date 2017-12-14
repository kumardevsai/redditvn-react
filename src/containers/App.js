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
import Stats from './Stats';
import NotFound from './NotFound';

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
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ScrollToTop>
            <Layout>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/post/:post_id" component={Post} />
                <Route exact path="/user/:user_id" component={User} />
                <Route path="/stats" component={Stats} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          </ScrollToTop>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
