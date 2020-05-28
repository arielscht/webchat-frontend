import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import openSocket from 'socket.io-client';
import dotenv from 'dotenv';

import Sidebar from '../../components/Sidebar';
import Chat from '../../components/Chat/Chat';
import Backdrop from '../../components/UI/Backdrop';

import * as actionCreators from '../../store/actions';
import socketContext from '../../context/socketContext';

import classes from './styles.module.css';

dotenv.config();

let socket = null; 

export default function Home() {
    
    const [showSideDrawer, setShowSideDrawer] = useState(true);
    const [timeoutsFriendsTyping, setTimeoutsFriendsTyping] = useState([]);

    const dispatch = useDispatch();
    const history = useHistory();

    const onAddNewMessage = message => dispatch(actionCreators.addMessage(message));
    const onUpdateFriendList = (friendId, message) => dispatch(actionCreators.updateFriendList(friendId, message));
    const onFriendTypingChanged = (friendId, typing) => dispatch(actionCreators.updateFriendTyping(friendId, typing));
    const onGetFriends = () => dispatch(actionCreators.getFriends());

    const { friendId, friends } = useSelector(state => {
        return {
            friendId: state.friends.currentFriend,
            friends: state.friends.friends
        }
    });

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
                }
                onUpdateFriendList(message.sender, message);
            })
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
                        console.log('clear');
                        onFriendTypingChanged(id, false);
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

    function closeSideDrawer() {
        if(showSideDrawer) {
            setShowSideDrawer(false);
        }
    }

    function openSideDrawer() {
        setShowSideDrawer(true);
    }
    
    return(
        <>
        {socket ?  
            <socketContext.Provider value={socket}>
            <div className={classes.mainDiv}>
                <Backdrop show={showSideDrawer} clicked={closeSideDrawer}/>
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