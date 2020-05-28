import React, { useEffect, useState } from 'react';
import { FiPlus, FiClock, FiUserCheck, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../../services/api';

import searchClasses from './SearchFriend.module.css';
import sidebarClasses from '../CSS/Sidebar.module.css';
import * as actionCreators from '../../../store/actions';

import Loader from '../../UI/Loader/Loader';

export default function SearchFriend({ closeSideDrawer }) {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const [usersFound, setUsersFound] = useState([]);
    const [friendsIds, setFriendsIds] = useState([]);
    const [pendingIds, setPendingIds] = useState([]);

    const token = localStorage.getItem('token');

    const dispatch = useDispatch();

    const { friendId } = useSelector(state => {
        return {
            friendId: state.friends.currentFriend
        }
    })

    const onSelectFriend = (newFriendId) => {
        closeSideDrawer();
        if(newFriendId !== friendId) {
            dispatch(actionCreators.updateCurrentFriend(newFriendId))
        }
    };

    useEffect(() => {
        const findUser = async () => {
            setLoading(true);
            try {
                const response = await api.post('/find', {search: input},{
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                console.log(response);
                setUsersFound(response.data.users);
                setFriendsIds(response.data.friendsIds);
                setPendingIds(response.data.pending);
                setLoading(false);
            } catch(err) {
                setLoading(false);
                console.log(err);
            }
        }

        if(input.length === 0){
            setUsersFound([]);
        } else {
            findUser();
        }
    }, [input]);

    const addFriend = async (userId) => {
        const data = {
            receiver: userId
        }
        try {
            const response = await api.post('/request', data, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setPendingIds(prevState => [...pendingIds, userId]);
        } catch(err) {
            console.log(err);
        }
    }

    return(
        <div className={searchClasses.searchFriendContainer}>
            <section className={searchClasses.searchHeader}>
            <input type="text" onChange={e => setInput(e.target.value)} placeholder="Buscar por nome ou nome de usuário"/>
            </section>
            <ul className={sidebarClasses.sidebarUl}>
            {loading ? <Loader/> : 
            usersFound.length < 1 && input.length > 0 ?
            <p className={searchClasses.noUser}>Usuário não encontrado</p>
            : null }
                {usersFound.map(friend => (
                    <li className={sidebarClasses.sidebarLi} key={friend.id}>
                        <p>{friend.name}</p>
                        <span className={searchClasses.iconGroup}>
                            {pendingIds.includes(friend.id) ? 
                                <>
                                <FiClock color={'gray'} size={20} className={[searchClasses.icon, searchClasses.noCursor].join(' ')} title="Convite pendente"/>
                                {/* <p>pendente</p> */}
                                </>
                            :friendsIds.includes(friend.id) ?
                                <FiUserCheck onClick={() => onSelectFriend(friend.id)} color={'green'} size={25} className={searchClasses.icon}/>
                            :
                                <FiPlus color={'green'} size={25} className={searchClasses.icon} onClick={() => addFriend(friend.id)} title="Adicionar como amigo"/>
                            }
                             {/* <FiPlus color={'green'} size={25} className="icon" onClick={() => addFriend(friend.id)} title="Adicionar como amigo"/> */}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}