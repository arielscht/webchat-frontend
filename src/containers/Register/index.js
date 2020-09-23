import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import Header from '../../components/UI/Header';
import formClasses from '../CSS/form.module.css';

export default function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);

    const history = useHistory();

    function validation(e, customMessage) {
        if(e) {
            e.preventDefault();
        }

        let messages = [];
        setValidationErrors([]);

        if(name.length < 1) {
            messages.push('Digite o seu nome');
        }

        if(username.length < 5) {
            messages.push('O nome de usuário deve ter pelo menos 5 caracteres');
        }
        
        if(password.length < 8) {
            messages.push('A senha deve ter pelo menos 8 caracteres');
        }

        if(customMessage) {
            messages.push(customMessage);
        }
        console.log('messages', messages);
        if(messages.length > 0) {
            return setValidationErrors(messages);
        } else {
            handleRegister();
        }
    }

    async function handleRegister() {
        const data = {
            name,
            username,
            password
        }

        try {
            await api.post('signup', data)
            history.push('/');
        } catch (error) {
            console.log(error.response.data.message);
            validation(null, error.response.data.message);
        }
        

    }

    return(
        <>
            <Header/>
            <div className={formClasses.formContainer}>
                <h1>Cadastrar-se</h1>
                <form onSubmit={validation}>
                    <input 
                        type="text" 
                        placeholder="Nome completo"
                        onChange={e => setName(e.target.value)}
                        />
                    <input 
                        type="text" 
                        placeholder="Nome de Usuário"
                        onChange={e => setUsername(e.target.value)}
                        />
                    <input 
                        type="password" 
                        placeholder="Senha"
                        onChange={e => setPassword(e.target.value)}
                    />
                    {validationErrors.map(error => (
                        <p className={formClasses.valError}>{error}</p>
                    ))}
                    <div className={formClasses.btnGroup}>
                        <Link to="/login">Voltar</Link>
                        <button type="submit">Cadastrar</button>
                    </div>
                </form>
            </div>
        </>
    );
}