import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import openSocket from 'socket.io-client';
import dotenv from 'dotenv';

import Sidebar from '../../components/Sidebar';
import Chat from '../../components/Chat/Chat';

import newMessageSong from '../../assets/songs/newMessage.mp3';

import * as actionCreators from '../../store/actions';
import socketContext from '../../context/socketContext';

import classes from './styles.module.css';

dotenv.config();

let socket = null; 
const newMessageAudio = new Audio(newMessageSong);

export default function Home() {
    
    const [showSideDrawer, setShowSideDrawer] = useState(true);
    const [timeoutsFriendsTyping, setTimeoutsFriendsTyping] = useState([]);
    const [browserTabActive, setBrowserTabActive] = useState(true);
    const [unreadMessages, setUnreadMessages] = useState([]);

    const dispatch = useDispatch();
    const history = useHistory();

    const { friendId, friends } = useSelector(state => {
        return {
            friendId: state.friends.currentFriend,
            friends: state.friends.friends,
        }
    });

    const onAddNewMessage = message => dispatch(actionCreators.addMessage(message));
    const onUpdateFriendList = (friendId, message, unreadMessages) => dispatch(actionCreators.updateFriendList(friendId, message, unreadMessages));
    const onFriendTypingChanged = (friendId, typing) => dispatch(actionCreators.updateFriendTyping(friendId, typing));
    const onGetFriends = () => dispatch(actionCreators.getFriends());
    const onReadMessages = (friendId, messages) => dispatch(actionCreators.updateMessagesReadStatus(friendId, messages));

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if(!userId || !token) {
        history.replace('/login');
    } else if(socket == null) {
        console.log('socket opened');
        socket = openSocket(process.env.REACT_APP_API_URL);
        socket.emit('user_connected', userId);
    }

    useEffect(() => {
        if(socket) {
            socket.off('newMessage');
            socket.on('newMessage', message => {
                if(message.sender === friendId) {
                    onAddNewMessage(message);
                    onUpdateFriendList(message.sender, message, null);
                    if(browserTabActive){
                        onReadMessages(friendId, [message]);
                    } else {
                        setUnreadMessages(prevState => [...prevState, message]);
                    }
                } 
                
                console.log('sender ', message.sender);
                const friend = friends.filter(friend => friend.id == message.sender);
                console.log('friend ', friend);
                const newUnreadMessages = friend[0].unreadMessages + 1;
                console.log('unread', newUnreadMessages);
                onUpdateFriendList(message.sender, message, newUnreadMessages);

                if(!browserTabActive || message.sender !== friendId) {
                    newMessageAudio.play();
                }
            })
        }
    }, [friendId, browserTabActive, friends]);

    useEffect(() => {
        if(unreadMessages.length > 0 && browserTabActive === true) {
            console.log('READDDDD');
            onReadMessages(friendId, unreadMessages);
        }
    }, [browserTabActive])

    useEffect(() => {
        if(friendId !== 0) {
            closeSideDrawer();
        }
    }, [friendId]);

    useEffect(() => {
        if(socket) {
            socket.off('typing');
            socket.on('typing', id => {
                console.log(id, 'is typing');
                onFriendTypingChanged(id, true);

                const newTimeoutsArray = [...timeoutsFriendsTyping];
                console.log(newTimeoutsArray);
                if(newTimeoutsArray.length > 0) {
                    console.log('new timeouts', newTimeoutsArray[0].userId);
                }
                const indexOfTyping = newTimeoutsArray.findIndex(user => {
                    console.log(user.userId, ' ',id);
                    return user.userId === id;
                });
                console.log(indexOfTyping);

                const newTimeout = { 
                    userId: id, 
                    timeout: setTimeout(function() {
                        // console.log('clear');
                        onFriendTypingChanged(id, false);
                        if(timeoutsFriendsTyping[indexOfTyping]) {
                            newTimeoutsArray.splice(indexOfTyping, 1);
                            setTimeoutsFriendsTyping(newTimeoutsArray);
                        }
                    }, 2000)
                };

                if(timeoutsFriendsTyping[indexOfTyping]) {
                    clearTimeout(timeoutsFriendsTyping[indexOfTyping].timeout);
                    newTimeoutsArray.splice(indexOfTyping, 1, newTimeout);
                } else {
                    newTimeoutsArray.push(newTimeout)
                }

                setTimeoutsFriendsTyping(newTimeoutsArray);
            });
        }
    }, [timeoutsFriendsTyping]);

    useEffect(() => {
        if(socket) {
            socket.on('userOnline', userId => {
                console.log('online');
                onGetFriends();
            })
            socket.on('userOffline', userId => {
                console.log('offline');
                onGetFriends();
            })
        }
        return () => {
            if(socket) {
                socket.close();
                socket = null;
            }
        }
    }, []);

    useEffect(() => {
        const reducer = (oldVal, newVal) => oldVal + newVal;
        const unreadMessagesQtd = friends.map(friend => friend.unreadMessages).reduce(reducer, 0);
        if(unreadMessagesQtd > 0) {
            document.title = '(' + unreadMessagesQtd + ') ' + 'WebChat';
        } else {
            document.title = 'WebChat';
        }
    }, [friends]);

    function closeSideDrawer() {
        if(showSideDrawer && friendId !== 0) {
            setShowSideDrawer(false);
        }
    }

    function openSideDrawer() {
        setShowSideDrawer(true);
    }

    window.onfocus = () => {
        setBrowserTabActive(true);
    }

    window.onblur = () => {
        setBrowserTabActive(false);
    }
    
    return(
        <>
        {socket ?  
            <socketContext.Provider value={socket}>
            <div className={classes.mainDiv}>
                <Sidebar opened={showSideDrawer} close={closeSideDrawer}/>
                <main>
                    {(friendId !== 0 && friends.length > 0)?
                        <Chat 
                            friend={friends.filter(friend => {return friend.id === friendId})}
                            openSideDrawer={openSideDrawer}/>
                    : null }
                </main>
            </div>
            </socketContext.Provider>
        : null }
        </>
    );
}