import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { combineReducers as combineReducersUtils } from 'redux-utils';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';

import duckReducer from '../duck/reducers';
const reducers = combineReducers({
  ...duckReducer,
  router: routerReducer,
});

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const routermiddleware = routerMiddleware(history);

let middleware = [thunk, routermiddleware];

// if (window.__REDUX_DEVTOOLS_EXTENSION__) {
//   const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   middleware = composeEnhancers(applyMiddleware(...middleware));
// } else {
//   middleware = applyMiddleware(...middleware);
// }

middleware = applyMiddleware(...middleware);

const store = createStore(reducers, {}, middleware);

export default store;
