import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, chatroom, username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  //Message body
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        chatroom: chatroom,
        author: username,
        message: currentMessage,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      console.log(messageData.author);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chatroom-window">
      <div>
        <p>Username</p>
      </div>
      <div className="chatroom-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message-content"
                id={username === messageContent.author ? "other" : "you"}
              >
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
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
