import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as actionCreators from '../../../store/actions';
import socketContext from '../../../context/socketContext';

import Loader from '../../UI/Loader/Loader';
import ChatNotification from '../../UI/ChatNotification';
import Message from './Message';

import scrollToBottom from '../../../utils/scrollToBottom';
import datesComparator from '../../../utils/datesComparator';

import classes from './styles.module.css';

const Messages = ({ message }) => {
    const [page, setPage] = useState(1);
    const [hasMore, sethasMore] = useState(true);

    const socket = useContext(socketContext);

    const dispatch = useDispatch();
    
    const onGetMessages = (friendId, page, friend) => dispatch(actionCreators.getMessages(friendId, page, friend));
    const onMessagesRead = (messagesIds) =>  dispatch(actionCreators.updateMessagesReadStatusLocally(messagesIds));

    let lastMessageDate = [[]];
    let lastMessageView = null;

    const { messages, loading, friend, friendId, totalMessages } = useSelector(state => {
        return {
            messages: state.messages.messages,
            loading: state.messages.loading,
            totalMessages: state.messages.totalMessages,
            friend: state.friends.friends.filter(friend => friend.id === state.friends.currentFriend),
            friendId: state.friends.currentFriend
        }
    });

    useEffect(() => {
        setPage(1);
        sethasMore(true);
        onGetMessages(friendId, 1, friend[0]);
        socket.off('messagesRead');
        socket.on('messagesRead', data => {
            if(data.friendId === friendId) {
                onMessagesRead(data.messagesIds);
            }
        });
    }, [friendId]);

    useEffect(() => {
        if(page === 1) {
            scrollToBottom(document.getElementById('messagesContainer'));
        }
        if(totalMessages <= messages.length && messages.length > 0){
            sethasMore(false);
        }
    }, [messages]);

    function scrollTracker() {
        const element =  document.getElementById('messagesContainer');
        console.log('tracking');
        if(element.scrollTop <= element.scrollHeight*0.1 && hasMore && !loading) {
            console.log('hey');
            setPage(prevPage => {
                onGetMessages(friendId, prevPage + 1);
                return prevPage + 1;
            });
        }
    }

    useEffect(() => {
        const messagesContainer = document.getElementById('messagesContainer');
        const resizeObserver = new ResizeObserver(() => {
            scrollToBottom(messagesContainer);
        })
        resizeObserver.observe(messagesContainer);
    }, []);
    return (
        <div className={classes.messagesContainer} id="messagesContainer" onScroll={scrollTracker}>
            <div className={classes.messagesWrapper}>
                {messages.map((message, index) => {
                    const messageDate = new Date(message.created_at);
                    const messageDay = messageDate.getDate();
                    const messageMonth = messageDate.getMonth() + 1;
                    const messageYear = messageDate.getFullYear();
                    const messageDateFormated = messageDay + '/' + messageMonth + '/' + messageYear;

                    const date = new Date();
                    

                    let messagesDateIndicator = null;
                    // let newMessagesIndicator = null;
                   
                    if(lastMessageDate.length > 1) {
                    if(messageDateFormated !== lastMessageDate[1] || index === messages.length - 1) {
                        const dateToPrint = datesComparator(date, lastMessageDate[2]);
                            messagesDateIndicator = <ChatNotification message={dateToPrint}/>
                        }
                    }
                    // console.log(message.read, lastMessageView);
                    // if(message.read == 1 && lastMessageView == 0) {
                    //     // console.log('new');
                    //     newMessagesIndicator = <ChatNotification message={"Novas Mensagens"}/>
                    // }

                    lastMessageDate[0] = [messageDay, messageMonth, messageYear];
                    lastMessageDate[1] = messageDateFormated;
                    lastMessageDate[2] = messageDate;
                    // lastMessageView = message.read;

                    return (
                        <React.Fragment key={message.id}>
                        {index !== messages.length - 1 ? messagesDateIndicator : null}
                        {/* <Message message={message} dateMessage={messageDateFormated}/> */}
                        {/* {newMessagesIndicator} */}
                        <Message message={message}/>
                        {index === messages.length - 1 ? messagesDateIndicator : null}
                        </React.Fragment>
                    );
                })}
                {loading ? 
                <div styles={{textAlign: 'center'}}>
                    <Loader/> 
                </div>
                : messages.length === 0 ?
               <ChatNotification message="Vocês ainda não possuem mensagens"/> : null}
            </div>
        </div>
    )
}


export default Messages;