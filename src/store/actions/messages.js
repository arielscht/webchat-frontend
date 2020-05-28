import * as actionTypes from './actionTypes';
import * as actionCreators from './index';

import api from './../../services/api';
import { updateFriendRequest } from './friends';

const initGetMessages = (page) => {
    return {
        type: actionTypes.INIT_GET_MESSAGES,
        page: page
    }
}

const setMessages = (messages, totalMessages, page) => {
    return {
        type: actionTypes.SET_MESSAGES,
        messages: messages,
        totalMessages: totalMessages,
        page: page
    }
}

export const getMessages = (friendId, page) => {
    return async dispatch => {
        dispatch(initGetMessages(page));
        try {
            const response = await api.get('/receive?friendId='+ friendId + '&page=' + page, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            console.log(response)
            dispatch(setMessages(response.data.messages, response.data.totalMessages, page));
        } catch(err) {
            console.log(err);
        }
    }
}

export const addMessage = (message) => {
    return {
        type: actionTypes.ADD_MESSAGE,
        message: message
    }
}

export const sendMessage = (friendId, message) => {
    return async dispatch => {
        const data = {
            type: 0,
            receiver: friendId,
            text: message
        }
        try {
            const response = await api.post('/send', data, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            dispatch(actionCreators.updateFriendList(friendId, response.data));
            dispatch(addMessage(response.data));
        } catch(err) {
            console.log(err);
        }
    }
}
