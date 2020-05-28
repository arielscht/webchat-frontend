import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
// import thunk from 'redux-thunk';
import store from './store/store';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import friendsReducer from './store/reducers/friendsReducer';
// import messagesReducer from './store/reducers/MessagesReducer';

// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

// const rootReducer = combineReducers({
//   friends: friendsReducer,
//   messages: messagesReducer
// });

// const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
