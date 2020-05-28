import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './containers/Login';
import Register from './containers/Register';
import Home from './containers/Home';
import PageNotFound from './containers/404';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/signup" component={Register}/>
                <Route path="/login" component={Login}/>
                <Route path="/" component={PageNotFound}/>
            </Switch>
        </BrowserRouter>
    );
}