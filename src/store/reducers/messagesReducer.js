import * as actionTypes from '../actions/actionTypes';

import updateObject from '../../utils/updateObject';

const initialState = {
    messages: [],
    totalMessages: 0,
    loading: false
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.INIT_GET_MESSAGES:
            if(action.page === 1) {
                return updateObject(state, { loading: true, messages: [] });
            } else {
                return updateObject(state, { loading: true });
            }
        case actionTypes.SET_MESSAGES:
            if(action.page === 1) {
                return updateObject(state, { loading: false, messages:  action.messages, totalMessages: action.totalMessages });
            } else if(action.page > 1) {
                return updateObject(state, { loading: false, messages: [...state.messages, ...action.messages], totalMessages: action.totalMessages });
            }
        case actionTypes.ADD_MESSAGE:
                return updateObject(state, { messages: [action.message, ...state.messages] });
        default: 
            return state;
    }
}

export default reducer;