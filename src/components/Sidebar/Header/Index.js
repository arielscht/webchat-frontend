import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { FiUserPlus, FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
import * as actionTypes from '../../../store/actions/actionTypes';
import socketContext from '../../../context/socketContext';

import Popover from '../../UI/Popover';

import classes from './style.module.css';
const SidebarHeader = ({ tabRendered, setTabRendered }) => {
    const [showLogoutPopover, setshowLogoutPopover] = useState(false);
    
    const socket = useContext(socketContext);

    const history = useHistory();
    
    const dispatch = useDispatch();

    const onLogout = () => dispatch({type: actionTypes.USER_LOGOUT});

    const { friendRequests } = useSelector(state => {
        return {
            friendRequests: state.friends.requests
        }
    })

    function handleLogOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
        onLogout();
        socket.disconnect();
        history.replace('/login');
    }

    return (
        <div className={classes.header}>
            <div>
                    <button className={classes.headerIcon} onClick={() => setshowLogoutPopover(!showLogoutPopover)}>
                            <FiLogOut size={20} color="black"/>
                            <Popover opened={showLogoutPopover}>
                                    <p className={classes.logoutParagraph}>Deseja sair?</p>
                                    <button className={[classes.logoutButton, classes.Danger].join(' ')} onClick={handleLogOut}>Sim</button>
                                    <button className={classes.logoutButton} onClick={() => setshowLogoutPopover(!showLogoutPopover)}>Não</button>
                            </Popover>
                    </button>
            </div>
            <div>
                <button 
                    className={[classes.headerIcon, tabRendered === 1 ? classes.tabSelected : null].join(' ')} 
                    onClick={() => {setTabRendered(1); /*GET FRIENDS*/}}
                >
                    <FiUsers size={20} color="black"/>
                </button>
                <button 
                    className={[classes.headerIcon, tabRendered === 2 ? classes.tabSelected : null].join(' ')} 
                    onClick={() => {setTabRendered(2)}}
                >
                        <FiUser size={20} color="black"/>
                        {friendRequests.length > 0 ?
                        <span className={classes.requestsNumber}>{friendRequests.length <= 10 ?
                            friendRequests.length
                        : '+10' }</span>
                        : null}
                </button>
                <button 
                    className={[classes.headerIcon, tabRendered === 3 ? classes.tabSelected : null].join(' ')} 
                    onClick={() => {setTabRendered(3)}}
                >
                    <FiUserPlus size={20} color="black"/>
                </button>
            </div>
        </div>
    );
}

export default SidebarHeader;