import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../utils/updateObject';

const initialState = {
    friends: [],
    requests: [],
    currentFriend: 0,
    loading: false
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.INIT_GET_FRIENDS:
            if(state.friends.length <= 0) {
                return updateObject(state, {loading: true});
            } else {
                return state;
            }
        case actionTypes.SET_FRIENDS:
            return updateObject(state, {friends: action.friends, loading: false});
        case actionTypes.INIT_GET_REQUESTS:
            return updateObject(state, {loading: true});
        case actionTypes.SET_REQUESTS:
            return updateObject(state, {requests: action.requests, loading: false});
        case actionTypes.UPDATE_FRIEND_REQUEST:
            const newRequests = [...state.requests];
            const requestIndex = newRequests.findIndex(request => request.id === action.requestId);
            newRequests.splice(requestIndex, 1);
            return updateObject(state, {requests: newRequests});
        case actionTypes.ADD_REQUEST:
            return updateObject(state, {requests: [...state.requests, action.request] });
        case actionTypes.SET_CURRENT_FRIEND:
            return updateObject(state, { currentFriend: action.friendId });
        case actionTypes.UPDATE_FRIEND_LIST:
            console.log('updateFriendList');
            console.log('lastMessage ', action.lastMessage);
            console.log('unreadMessages ', action.unreadMessages);
            const friendsArray = [...state.friends];
            const friendIndex = friendsArray.findIndex(friend => friend.id === action.friendId);
            const currentFriend = updateObject(friendsArray[friendIndex], {});
            let updatedFriend = currentFriend;
            if(action.lastMessage !== null) {
                console.log('updateLastMessage');
                updatedFriend = updateObject(updatedFriend, { lastMessage: action.lastMessage });
            } 
            if(action.unreadMessages !== null) {
                console.log('updateUnreadMessages');
                updatedFriend = updateObject(updatedFriend, { unreadMessages: action.unreadMessages });
            }
            friendsArray.splice(friendIndex, 1);
            friendsArray.unshift(updatedFriend);
            return updateObject(state, { friends: friendsArray });
        case actionTypes.UPDATE_FRIEND_TYPING:
            const friends = [...state.friends];
            const index = friends.findIndex(friend => friend.id === action.friendId);
            const friend = updateObject(friends[index], {});
            const newFriendObject = updateObject(friend, { typing: action.typing });
            friends[index] = newFriendObject;
            return updateObject(state, { friends: friends });
        default: 
            return state;
    }
}

export default reducer;