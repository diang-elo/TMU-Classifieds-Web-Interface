import { useState } from "react";

//this function handles login functionality. You login using e-mail and a password.
function Registration() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    //below is a function that handles sending a payloard of data to server and getting back a jsonwebtoken
    const registrationData = () => {
        console.log(email+" "+password);
        //data sent to server
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        };
        //data received from server
        fetch('http://localhost:10000/auth/registration', requestOptions)
            .then(response => response.json())
            .then((data) => {
                if (data.message === 'success') {
                    setEmail('')
                    setPassword('')
                    alert("Account Registered successfully.")
                }
                else if (data.message === "exists") {
                    alert("that email is already used elsewhere")
                } else {
                    alert("oops, something went wrong when trying to register your account")
                }
            });
    }
    //triggers when we click on submit
    const handleSubmit = (e) => {
        e.preventDefault();
        registrationData();
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;