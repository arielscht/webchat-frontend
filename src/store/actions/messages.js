import * as actionTypes from './actionTypes';
import * as actionCreators from './index';

import api from './../../services/api';

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

export const getMessages = (friendId, page, friend) => {
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
            if(friend && friend.unreadMessages > 0) {
                console.log('updatemessages');
                dispatch(updateMessagesReadStatus(friendId, response.data.messages));
            }
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
            dispatch(actionCreators.updateFriendList(friendId, response.data, null));
            dispatch(addMessage(response.data));
        } catch(err) {
            console.log(err);
        }
    }
}

export const updateMessagesReadStatus = (friendId, messages) => {
    return async dispatch => {
        const messagesIds = messages.filter(message => {
            if(message.sender === friendId && message.read === 0) {
                return message;
            }
        }).map(message => message.id);
        console.log('All Messages', messages);
        console.log('Unread MEssages ids', messagesIds);

        const data = {messagesIds}

        try {
            const response = await api.put('/read', data, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            console.log(response);
            dispatch(actionCreators.updateFriendList(friendId, null, 0));
        } catch(err) {
            console.log(err);
        }
    }
}

export const updateMessagesReadStatusLocally = (messagesIds) => {
    return {
        type: actionTypes.UPDATE_MESSAGES_READ_STATUS,
        messagesIds: messagesIds
    }
}
