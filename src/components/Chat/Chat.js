import React from 'react';

import api from '../../services/api';
import socketContext from '../../context/socketContext';

import MessageForm from './MessageForm/MessageForm';
import Messages from './Messages';

import classes from './chat.module.css';

export default function ChatContainer({ friend, openSideDrawer }) {
    return (
        <>
        <div className={classes.header}>
            <div className={classes.sideDrawerToggle} onClick={openSideDrawer}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div>
                <p className={classes.headerParagraph}>{friend[0].name}</p>
                <p className={classes.online}>
                    {friend[0].typing ? 'Digitando...' : friend[0].online ? 'Online' : null}
                </p>
            </div>
        </div>
        <Messages/>
        <MessageForm />
        </>
    );
}