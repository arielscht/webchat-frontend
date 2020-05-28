import React, { useEffect, useContext, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import he from 'he';
import { useSelector, useDispatch } from 'react-redux';

import * as actionCreators from '../../../store/actions';
import scrollToBottom from '../../../utils/scrollToBottom';

import classes from './MessageForm.module.css';

import SocketContext from '../../../context/socketContext';

export default function MessageForm({ changed, submited, message }) {
    const [messageInput, setMessageInput] = useState('');
    
    let divInput;
    let btnForm;
    let placeholder;

    const { friendId } = useSelector(state => {
        return {
            friendId: state.friends.currentFriend
        }
    })

    const dispatch = useDispatch();

    const onSendMessage = (e, message) => {
        e.preventDefault();
        setMessageInput('');
        if(message.length <= 0) {
            return;
        }
        dispatch(actionCreators.sendMessage(friendId, message));
        scrollToBottom(document.getElementById('messagesContainer'));
    };

    const userId = localStorage.getItem('userId');

    const socket = useContext(SocketContext)

    function inputChanged(e) {
        console.log(e);
        console.log('height', divInput.offsetHeight);
       
        if(divInput.innerHTML.length == 0 ) {
            placeholder.style.visibility = 'visible';
        } else if (divInput.innerHTML.length > 0){ 
            placeholder.style.visibility = 'hidden';
        }

        if(e.key === "Enter" && divInput.innerHTML.length > 0) {
            placeholder.style.visibility = 'visible';
            return btnForm.click();
        }

        socket.emit('typing', {
            sender: userId,
            receiver: friendId
        });
        setMessageInput(he.decode(divInput.innerHTML));
    }

    function preventBreak(e) {
        if (divInput.innerHTML.length > 0){ 
            placeholder.style.visibility = 'hidden';
        }
        if(e.key === 'Enter') {
            e.preventDefault();
        }
    }

    function clearInput(input) {
        placeholder.style.visibility = 'visible';
        divInput.innerHTML = '';
        divInput.focus();
        // typed = false;
        // addPlaceholder();
    }

    function pasteCleaner(event) {
        event.preventDefault();
        let text = event.clipboardData.getData('text/plain');
        console.log('TEXT', text);
        divInput.innerHTML = divInput.innerHTML + he.encode(text);

        console.log('innerHTML', divInput.innerHTML);
        let setpos = document.createRange();
        let set = window.getSelection();
        console.log(divInput.childNodes);
        setpos.setStart(divInput.childNodes[0], he.decode(divInput.innerHTML).length);
        setpos.collapse(true);
        set.removeAllRanges();
        set.addRange(setpos);
        divInput.focus();
    }
    
    useEffect(() => {
        divInput = document.getElementById('input');
        // divInput.addEventListener('focusin', clearPlaceholder);
        // divInput.addEventListener('focusout', addPlaceholder);
        divInput.addEventListener('keyup', e => inputChanged(e));
        divInput.addEventListener('keydown', e => preventBreak(e));
        divInput.addEventListener('paste', e => pasteCleaner(e));
        // divInput.addEventListener('input', (e) => {inputChanged(e); preventBreak(e);});

        placeholder = document.getElementById('placeholder');

        btnForm = document.getElementById('btnForm');
        btnForm.addEventListener('click', clearInput);

    }, []);



    return (
        <form className={classes.form} id="form" onSubmit={e => onSendMessage(e, messageInput)}>
            <div className={classes.inputWrapper}>
                <div id="placeholder" styles="visibility: visible" className={classes.fakeInput}>
                    Digite sua mensagem
                </div>
                <span contentEditable="true"
                    className={classes.input}
                    value={messageInput}
                    id="input"
                >
                </span>
            </div>
            <button type="submit" id="btnForm" className={classes.button}><IoMdSend size={20} color="#FFF"/></button>
        </form>
    );
}