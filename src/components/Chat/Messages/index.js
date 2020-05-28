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
    
    const onGetMessages = (friendId, page) => dispatch(actionCreators.getMessages(friendId, page));

    let lastMessageDate = [[]];

    const { messages, loading, friendId, totalMessages } = useSelector(state => {
        return {
            messages: state.messages.messages,
            loading: state.messages.loading,
            totalMessages: state.messages.totalMessages,
            friendId: state.friends.currentFriend
        }
    });

    useEffect(() => {
        setPage(1);
        sethasMore(true);
        onGetMessages(friendId, 1);
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
                   
                    if(lastMessageDate.length > 1) {
                    if(messageDateFormated !== lastMessageDate[1] || index === messages.length - 1) {
        
                    const dateToPrint = datesComparator(date, lastMessageDate[2]);
                        messagesDateIndicator = <ChatNotification message={dateToPrint}/>
                    }
                    }

                    lastMessageDate[0] = [messageDay, messageMonth, messageYear];
                    lastMessageDate[1] = messageDateFormated;
                    lastMessageDate[2] = messageDate;

                    return (
                        <React.Fragment key={message.id}>
                        {index !== messages.length - 1 ? messagesDateIndicator : null}
                        {/* <Message message={message} dateMessage={messageDateFormated}/> */}
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