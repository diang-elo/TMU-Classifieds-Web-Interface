import { useState } from "react";

//this function handles login functionality. You login using e-mail and a password.
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //below is a function that handles sending a payloard of data to server and getting back a jsonwebtoken
  const loginData = () => {
    console.log(email + " " + password);
    //data sent to server
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    };
    //data received from server
    fetch(
      "https://tmu-classifieds-web-interface.onrender.com/auth/login",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          //we store the jsonwebtoken on the local storage of the browser
          localStorage.setItem("jwttoken", data.token);
          setEmail("");
          setPassword("");
          alert("You successfully logged in.");
        } else {
          alert("oops, something went wrong when trying to login");
        }
      });
  };
  //triggers when we click on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    loginData();
  };

  return (
    <div>
      <h2>Fill out your e-mail and password below</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-Mail:&nbsp;</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:&nbsp;</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log-in</button>
      </form>
    </div>
  );
}

export default Login;
