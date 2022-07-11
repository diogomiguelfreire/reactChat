import React, { useState } from "react";

function Chat({ socket, chatroom, username }) {
  const [currentMessage, setCurrentMessage] = useState("");

  //Message body
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        chatroom: chatroom,
        author: username,
        message: currentMessage,
      };

      await socket.emit("send_message", messageData);
    }
  };

  return (
    <div>
      <div>
        <p>Username</p>
      </div>
      <input
        type="text"
        placeholder="..."
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
      ></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
