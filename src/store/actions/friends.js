import * as actionTypes from './actionTypes';
import api from '../../services/api';

import updateObject from '../../utils/updateObject';

const initGetFriends = () => {
    return {
        type: actionTypes.INIT_GET_FRIENDS
    }
}

const onGotFriends = (friends = []) => {
    return {
        type: actionTypes.SET_FRIENDS,
        friends: friends
    }
}

export const getFriends = () => {
   return async dispatch => {
       dispatch(initGetFriends());
       try {
            const response = await api.get('/friends', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            const friends = [...response.data.friends];
            
            const lastMessagesResponse = await api.get('/recent', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            const unreadMessagesResponse = await api.get('/unread',{
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            
            const lastMessages = lastMessagesResponse.data;
            const unreadMessagesCount = unreadMessagesResponse.data;
            console.log(unreadMessagesCount);
            
            // const friendsArray = friends.map((friend, index) => {
            //     for(let message of lastMessages) {
            //         if(message.friendId === friend.id) {
            //             return updateObject(friend, {
            //                 lastMessage: message.message,
            //                 typing: false
            //             });
            //         }
            //     }
            // });
            const friendsArray = friends.map((friend, index) => {
                let objectToMerge = {}
                for(let message of lastMessages) {
                    if(message.friendId === friend.id) {
                        objectToMerge = updateObject(friend, {
                            lastMessage: message.message,
                            typing: false
                        });
                        break;
                    }
                }
                for(let friendMessages of unreadMessagesCount) {
                    if(friendMessages.friendId === friend.id) {
                        return updateObject(objectToMerge, {
                            unreadMessages: friendMessages.count
                        });
                    }
                }
            });
            // friendsArray = friendsArray.map((friend, index) => {
            //     for(let friendMessages of unreadMessagesCount) {
            //         if(friendMessages.friendId === friend.id) {
            //             return updateObject(friend, {
            //                 unreadMessages: friendMessages.count
            //             });
            //         }
            //     }
            // });

            friendsArray.sort(function (a, b) {
                if(b.lastMessage && a.lastMessage) {
                    return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at);
                } else if(!b.lastMessage && a.lastMessage) {
                    return -1;
                } else if(!a.lastMessage && b.lastMessage) {
                    return 1;
                } else {
                    return -1;
                }
            });

            console.log('friends', friendsArray);
            dispatch(onGotFriends(friendsArray));
       } catch(err) {
            console.log(err);
       }
   }
};

const initGetRequests = () => {
    return {
        type: actionTypes.INIT_GET_REQUESTS
    }
}

const onGotRequests = (requests) => {
    return {
        type: actionTypes.SET_REQUESTS,
        requests: requests
    }
}

export const getRequests = () => {
    return async dispatch => {
        dispatch(initGetRequests());

        try {
            const requests = await api.get('/requests', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            dispatch(onGotRequests(requests.data));
        } catch (err) {
            console.log(err);
        }
    }
}

const updateRequest = (requestId) => {
    return {
        type: actionTypes.UPDATE_FRIEND_REQUEST,
        requestId: requestId
    }
}

export const updateFriendRequest = (newStatus, requestId) => {
    return async dispatch => {
        const data = {
            newStatus,
            requestId
        };

        try {
            const response = await api.put('/request', data, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            dispatch(updateRequest(requestId))
        } catch(err) {
            console.log(err);
        }
    }
}

export const updateCurrentFriend = (friendId) => {
    return {
        type: actionTypes.SET_CURRENT_FRIEND,
        friendId: friendId
    }
}

export const updateFriendList = (friendId, newLastMessage, newUnreadMessages) => {
    return {
        type: actionTypes.UPDATE_FRIEND_LIST,
        friendId: friendId,
        lastMessage: newLastMessage,
        unreadMessages: newUnreadMessages
    }
}

export const addRequest = (request) => {
    return {
        type: actionTypes.ADD_REQUEST,
        request: request
    }
}

export const updateFriendTyping = (friendId, typing) => {
    return {
        type: actionTypes.UPDATE_FRIEND_TYPING,
        friendId: friendId,
        typing: typing
    }
};