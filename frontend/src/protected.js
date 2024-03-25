import React from 'react';
import { useState, useEffect } from "react";

//this is rudimentary test page. It's unimportant, and only tests if I did jsonwebtoken correctly
function Protected() {
    //below, I will test the function to check jwt token and for it being correct
    const [correctToken, setCorrectToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwttoken')
        console.log(token);
        fetch('http://localhost:10000/auth/protected', {
            method: 'GET',
            headers: {
            'jwttoken': token,
          },
        })
          .then((res) => res.json())
          .then((data) => setCorrectToken(data.boolToken))
      }, [])
      console.log("this is supposed to be correct: " +correctToken);
    if (!correctToken){
        return (
            <div>
                <h2>You don't have access</h2>
            </div>
        )
    };

/*     const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token },
    };
    fetch('http://localhost:10000/auth/protected', requestOptions)
        .then(response => response.json())
        .then((data) => setCorrectToken(data.correctToken)); */

    
    return (
        <div>
            <h2>You should only see this if you have a token</h2>
        </div>
    )
};


export default Protected;