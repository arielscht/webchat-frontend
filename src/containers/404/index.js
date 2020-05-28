import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/UI/Header';

import Sidebar from '../../components/Sidebar';

export default function PageNotFound() {
    const btnStyle = {
        width: '150px',
        textAlign: 'center',
        padding: '5px',
        height: '30px',
        backgroundColor: '#381460',
        color: 'white',
        borderRadius: '8px',
        margin: '15px',
        display: 'block',
        textDecoration: 'none'
    };

    const h1Style = {
        margin: '15px'
    }

    return(
        <>
        <Sidebar/>
        <Header/>
        <h1 style={h1Style}>Ops! A página que você está procurando não existe</h1>
        <Link to='/' style={btnStyle}>Voltar para Home</Link>
        </>
    );
}

