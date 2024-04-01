import { useState } from "react";

//this function handles login functionality. You login using e-mail and a password.
function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

    const checkHandler = () => {
        setAdmin(!admin);
      }
    
    //below is a function that handles sending a payloard of data to server and getting back a jsonwebtoken
    const registrationData = () => {
        console.log(email+" "+password);
        //data sent to server
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, password: password, isAdmin: admin })
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
        if (!validEmail.test(email)){
            alert("Incorrect email. Please type email in format xyz@email.com");
            return;
        }
        registrationData();
    }

    return (
        <div>
            <h2>Fill out your e-mail and password below</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:&nbsp;</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>E-Mail:&nbsp;</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:&nbsp;</label>
                    <textarea value={password} onChange={(e) => setPassword(e.target.value)}></textarea>
                </div>
                <div>
                    <label>Are you an Admin?:&nbsp;</label>
                    <input type="checkbox" checked={admin} onChange={checkHandler}></input>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;