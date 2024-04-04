import React from "react";
import PostAdForm from "../components/PostAdForm";
import { useState, useEffect } from "react";
import Chat from "../components/Chat";

function ChatScreen() {
  const [correctToken, setCorrectToken] = useState("");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwttoken");
    console.log(token);
    fetch("http://localhost:10000/auth/protected", {
      method: "GET",
      headers: {
        jwttoken: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCorrectToken(data.success);
        setUserData(data.data);
        console.log(data.data);
      });
  }, []);
  if (!correctToken) {
    return (
      <div>
        <h2>Please Login or register before accessing this page</h2>
      </div>
    );
  }
  return (
    <div>
      <Chat userData={userData} />
    </div>
  );
}

export default ChatScreen;
