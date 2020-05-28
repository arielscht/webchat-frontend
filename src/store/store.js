import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import * as actionTypes from './actions/actionTypes';
import friendsReducer from './reducers/friendsReducer';
import messagesReducer from './reducers/messagesReducer';
import dotenv from 'dotenv';
dotenv.config();
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : null || compose;

const appReducer = combineReducers({
  friends: friendsReducer,
  messages: messagesReducer
});

const rootReducer = (state, action) => {
    if(action.type === actionTypes.USER_LOGOUT) {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;