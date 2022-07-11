import React, { useEffect, useState } from "react";

function Chat({ socket, chatroom, username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  //Message body
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        chatroom: chatroom,
        author: "username",
        message: currentMessage,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      <div>
        <p>Username</p>
      </div>
      <div>
        {messageList.map((messageContent) => {
          return (
            <div>
              <p>{messageContent.message}</p>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="..."
        value={currentMessage}
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
      ></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
