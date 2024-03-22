import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Login.css";
import React, { useState} from 'react';

//this function handles login functionality. You login using e-mail and a password.
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //add an onSubmit funcitonality

    return (
        <div>
            <h2>Fill out your e-mail and password below</h2>
            <form>
                <div>
                    <label>E-Mail:&nbsp;</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:&nbsp;</label>
                    <textarea value={password} onChange={(e) => setPassword(e.target.value)}></textarea>
                </div>
                <button type="submit">Log-in</button>
            </form>
        </div>
    );
}

export default Login;