import React from 'react';

import classes from './styles.module.css';

const ChatNotification = ({message}) => {
    return (
        <div className={classes.notificationContainer}>
            <p className={classes.noMessages}>{message}</p>
        </div>
    );
}

export default ChatNotification;