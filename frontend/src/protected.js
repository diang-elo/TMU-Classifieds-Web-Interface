import React from 'react';

//this is rudimentary test page. It's unimportant, and only tests if I did jsonwebtoken correctly
function Protected() {
    const token = localStorage.getItem("jwt-token");

    if (!token){
        return(
            <div>
                <h2>You don't have access</h2>
            </div>
        )
    }
    else {
        return (
        <div>
            <h2>You should only see this if you have a token</h2>
        </div>
        );
    }
}
export default Protected;