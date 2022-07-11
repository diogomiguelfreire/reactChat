import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, chatroom }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [username, setUsername] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [otherUsername, setOtherUsername] = useState("");

  //Message body
  const sendMessage = async () => {
    if (currentMessage !== "") {
      let type = "message";
      let newName = username;
      if (currentMessage.search("/nick") == 0) {
        type = "nameChange";
        newName = currentMessage.replace("/nick", "");
      }
      const messageData = {
        chatroom: chatroom,
        author: newName,
        message: currentMessage,
        id: socket.id,
        type: type,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setUsername(newName);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.type === "nameChange") {
        setOtherUsername(data.author);
      }
      setMessageList((list) => [...list, data]);
      console.log(messageList);
    });
  }, [socket]);

  return (
    <div className="chatroom-window">
      <div>
        <p>{otherUsername}</p>
      </div>
      <div className="chatroom-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            if (messageContent.type === "message") {
              return (
                <div
                  className="message-content"
                  id={socket.id === messageContent.id ? "other" : "you"}
                >
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                </div>
              );
            }
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
