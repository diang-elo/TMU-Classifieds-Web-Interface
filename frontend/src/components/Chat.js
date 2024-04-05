import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = ({ userData }) => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [lastMessageSentAt, setLastMessageSentAt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit action

    if (!message.trim()) return; // Check if the message is not just empty spaces

    try {
      const response = await axios.post("http://localhost:10000/sendMessage", {
        sender: userData.email, //
        message: message,
      });
      setLastMessageSentAt(new Date());
      setMessage(""); // Clear the message input after sending
      console.log("Message sent:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // Function to fetch messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:10000/getMessages");
        setChats(response.data); // Store messages in state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Set up an interval to fetch messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [lastMessageSentAt]);

  return (
    <div>
      <h1>Chat</h1>
      <div className="chat-container">
        {chats.map((chatMessage) => (
          <div
            key={chatMessage._id}
            className={`chat-message ${
              chatMessage.sender === userData.email ? "sent" : "received"
            }`}
          >
            <span className="message">{chatMessage.message}</span>
            {/* Display createdAt if available */}
            <span className="metadata">{chatMessage.sender}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          label="message"
          type="text"
          placeholder="Enter message"
          name="name"
          required={true}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSubmit}>{/* <SendIcon /> */} Send</button>
      </div>
    </div>
  );
};

export default Chat;
