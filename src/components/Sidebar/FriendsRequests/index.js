import React, { useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import * as actionCreators from '../../../store/actions';

import requestsClasses from './FriendsRequest.module.css';
import sidebarClasses from '../CSS/Sidebar.module.css';

import Loader from '../../UI/Loader/Loader';

export default function FriendsRequests() {

    const dispatch = useDispatch();

    const onGetRequests = () => dispatch(actionCreators.getRequests());
    const onUpdateRequest = (newStatus, requestId) => dispatch(actionCreators.updateFriendRequest(newStatus, requestId));

    const { loading, requests } = useSelector(state => {
        return {
            loading: state.friends.loading,
            requests: state.friends.requests
        }
    })

    useEffect(() => {
        onGetRequests();
    }, []);
    return(
        <ul className={sidebarClasses.sidebarUl}>
            {loading ? <Loader/> :
                requests.length < 1 ? 
                <p className={requestsClasses.noRequests}>Você não possui nenhuma solicitação de amizade</p>
            :
            requests.map(request => (
                <li className={sidebarClasses.sidebarLi} key={request.id}>
                    <p className={requestsClasses.requesterName} title={request.requester.name}>{request.requester.name}</p>
                    <span className={requestsClasses.iconGroup}>
                        <FiCheck color={'green'} size={25} className={requestsClasses.icon} onClick={() => onUpdateRequest(1, request.id)}/>
                        <FiX color={'red'} size={25} className={requestsClasses.icon} onClick={() => onUpdateRequest(0, request.id)}/>
                    </span>
                </li>
            ))}
        </ul>
    );
}