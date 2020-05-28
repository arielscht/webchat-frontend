import React from 'react';

import classes from './styles.module.css';

const messageClasses = [classes.messageContainer];

const Message = ({ message }) => {
    const userId = localStorage.getItem('userId');

    let date = new Date(message.created_at);
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    
    messageClasses.splice(1,1);
    if(message.receiver == userId) {
        messageClasses.push(classes.received);
    } else {
        messageClasses.push(classes.sent);
    }
    return (
        <div className={messageClasses.join(' ')}>
            <div className={classes.message}>
                <p className={classes.text}>{message.text}</p>
                <p className={classes.time}>{hour}:{minute.length === 1 ? "0" + minute : minute}</p>
                {/* <p className={classes.time}>{dateMessage}</p> */}
            </div>
        </div>
    );
}

export default Message;