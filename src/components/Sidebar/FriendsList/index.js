import React, { useEffect, useContext } from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import * as actionCreators from '../../../store/actions';
import socketContext from '../../../context/socketContext';

import datesComparator from '../../../utils/datesComparator';

import Loader from '../../UI/Loader/Loader';

import friendsClasses from './FriendList.module.css';
import sidebarClasses from '../CSS/Sidebar.module.css';
import classes from './FriendList.module.css';

function FriendList({ closeSideDrawer }) {
    const dispatch = useDispatch();

    const socket = useContext(socketContext);
    
    const { friends, loading, friendId, messages } = useSelector(state => {
        return {
            friends: state.friends.friends,
            loading: state.friends.loading,
            friendId: state.friends.currentFriend,
            messages: state.messages.messages
        }
    })

    const onGetFriends = () => dispatch(actionCreators.getFriends());
    // const onReadMessages = (friendId, messages) => dispatch(actionCreators.updateMessagesReadStatus(friendId, messages));
    
    const onSelectFriend = (newFriendId) => {
        closeSideDrawer();
        if(newFriendId !== friendId) {
            dispatch(actionCreators.updateCurrentFriend(newFriendId))
        }
    }; 


    useEffect(() => {
        onGetFriends();
        socket.on('requestAccepted', () => {
            // console.log('requestAccepted');
            onGetFriends();
        });
    }, []);

    const onClickFriend = (friendId) => {
        onSelectFriend(friendId);
        // if(unreadMessages > 0) {
        //     onReadMessages(friendId, messages);
        //     //update the read status to '1';
        //     //update unreadMessages to 0;
        // }
    }

    return(
        <ul className={sidebarClasses.sidebarUl}>
            {friends.length < 1 && !loading ? 
            <p className={friendsClasses.noFriend}>Você não possui amigos</p>
            : loading ? <Loader/> : null}
            {friends.map((friend, index )=> {
                let lastMessageTime = null
                if(friend.lastMessage) {
                    const messageDate = new Date(friend.lastMessage.created_at);
                    const messageHour = messageDate.getHours().toString();
                    const messageMinute = messageDate.getMinutes().toString();

                    const dateToPrint = datesComparator(new Date(), messageDate);

                    // lastMessageTime = <p>{messageHour + ":"}{messageMinute.length === 1 ? "0" + messageMinute : messageMinute}</p>;
                    if(dateToPrint === 'Hoje') {
                        if(messageMinute.length != 1) {
                            lastMessageTime = messageHour + ':' + messageMinute;
                        } else {
                            lastMessageTime = messageHour + ':' + '0' + messageMinute;
                        }
                    } else {
                        lastMessageTime = dateToPrint;
                    }
                }

                return (
                    <li 
                        key={friend.id}
                        className={friendsClasses.li}
                        onClick={() => onClickFriend(friend.id)}
                    >
                        <div className={friendsClasses.friendNameWrapper}>
                            <p className={friendsClasses.friendName} title={friend.name}>{friend.name}</p>
                            <div className={friendsClasses.onlineAndTimeWrapper}>
                                {  
                                    friend.online ? 
                                    <div className={friendsClasses.online}></div> : 
                                    null
                                }
                                <p className={friendsClasses.lastMessageTime}>{lastMessageTime}</p>
                            </div>
                        </div>
                        <div className={friendsClasses.lastMessageContainer}>
                        {
                        friend.typing ? 
                            <p className={friendsClasses.typing}>Digitando...</p> :
                        friend.lastMessage ? 
                        
                            <div className={friendsClasses.lastMessageAndIconWrapper}>
                                {friend.lastMessage.sender === friend.id ?
                                <FiArrowDownRight color={'blue'} size={15} />
                                : <FiArrowUpRight color={'green'} size={15} />}
                                <p className={friendsClasses.lastMessage}>
                                    {friend.lastMessage.text}
                                </p>
                            </div>
                            
                        
                        : null}
                        {friend.unreadMessages > 0 ?
                            <span className={classes.unreadMessages}>
                                {friend.unreadMessages}
                            </span>
                        : null}
                        </div>
                        
                        
                    </li>
                )
            })}
        </ul>
    );
}

export default React.memo(FriendList);