import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import * as actionCreators from '../../store/actions';
import socketContext from '../../context/socketContext';

import classes from './style.module.css';

import Header from './Header/Index';
import FriendList from './FriendsList';
import FriendsRequests from './FriendsRequests';
import SearchFriend from './SearchFriend';
import Backdrop from '../../components/UI/Backdrop';

const Sidebar = ({ opened, close }) => {
    const [tabRendered, setTabRendered] = useState(1);

    const socket = useContext(socketContext);

    const dispatch = useDispatch();

    const onGetRequests = () => dispatch(actionCreators.getRequests());
    const onNewRequest = (request) => dispatch(actionCreators.addRequest(request));

    useEffect(() => {
        socket.on('newRequest', request => {
            console.log('newRequest');
            onNewRequest(request);
        });
        onGetRequests();
    }, []);

    const sidebarClasses = [classes.aside];

    if(!opened) {
        sidebarClasses.push(classes.close);
    }

    return (
        <>
        <Backdrop show={opened} clicked={close}/>
        <aside className={sidebarClasses.join(' ')}>
            <Header tabRendered={tabRendered} setTabRendered={setTabRendered}/>
            { tabRendered === 1 ?
                <FriendList closeSideDrawer={close}/>
                : tabRendered === 2 ?
                <FriendsRequests/>
                : tabRendered === 3 ?
                <SearchFriend closeSideDrawer={close}/>
                : null}
        </aside>
        </>
    );
};

export default Sidebar;