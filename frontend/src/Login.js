import { useState } from "react";
import "./Login.css";

//this function handles login functionality. You login using e-mail and a password.
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //add an onSubmit funcitonality

    const loginData = () => {
        console.log(email+" "+password);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        };
        fetch('http://localhost:10000/auth/login', requestOptions)
            .then(response => response.json())
            .then((data) => {
                if (data.message === 'success') {
                    localStorage.setItem('jwt-token', data.token)
                    setEmail('')
                    setPassword('')
                } else {
                    alert("oops, something went wrong when trying to login")
                }
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loginData();
    }

    return (
        <div>
            <h2>Fill out your e-mail and password below</h2>
            <form onSubmit={handleSubmit}>
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