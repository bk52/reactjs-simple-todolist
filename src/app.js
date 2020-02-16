import React, { Component } from 'react'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"; 


import ToDo from "./pages/home";

export class App extends Component
{
    render(){
        return (
            <Router>
                <div style={{ marginBottom: "70px" }}>
                    <Switch>
                        <Route path="/">
                            <ToDo />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}
