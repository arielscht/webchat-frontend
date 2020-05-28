import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import Header from '../../components/UI/Header';
import formClasses from '../CSS/form.module.css';

import datesComparator from '../../utils/datesComparator';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);

    const history = useHistory();

    useEffect(() => {
        // console.log(new Date());
        // console.log(new Date(2020,4,28));
        datesComparator(new Date(), new Date(2020, 4, 25));
    });

    function validation(e, customMessage) {
        if(e) {
            e.preventDefault();
        }

        let messages = [];

        if(username.length < 5) {
            messages.push('Digite seu nome de usuário.');
        }
        if(password.length < 8) {
            messages.push('Digite uma senha valida.');
        }

        if(customMessage) {
            messages.push(customMessage);
        }

        if(messages.length > 0) {
            return setValidationErrors(messages);
        }

        handleLogin();
    }

    async function handleLogin() {
        const data = {
            username,
            password
        }

        try {
            const response = await api.post('login', data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            console.log(localStorage.getItem('token'));
            console.log(localStorage.getItem('userId'));
            history.push('/');
        } catch (error) {
            validation(null, error.response.data);
        }
    }

    return(
        <>
            <Header/>
            <div className={formClasses.formContainer}>
                <h1>Login</h1>
                <form onSubmit={validation}>
                    <input type="text" placeholder="Nome de Usuário" onChange={e => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)}/>
                    {validationErrors.map(error => (
                        <p className={formClasses.valError}>{error}</p>
                    ))}
                    <div className={formClasses.btnGroup}>
                        <Link to="/signup">Cadastrar-se</Link>
                        <button type="submit">Entrar</button>
                    </div>
                </form>
            </div>
        </>
    );
}