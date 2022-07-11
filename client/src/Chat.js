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
      let message = currentMessage;
      if (currentMessage.search("/nick") == 0) {
        type = "nameChange";
        newName = currentMessage.replace("/nick", "");
      } else if (currentMessage.search("/think") == 0) {
        message = currentMessage.replace("/think", "");
      }

      if (currentMessage.search("/opps") == 0) {
        type = "delete";
        for (let index = messageList.length - 1; index >= 0; index--) {
          if (messageList[index].id === socket.id) {
            let x = messageList.splice(index, 1);
            setMessageList(messageList.splice(index, 1));
            console.log(x);
          }
        }
      }
      const messageData = {
        chatroom: chatroom,
        author: newName,
        message: message,
        think: currentMessage.search("/think") == 0,
        id: socket.id,
        type: type,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setUsername(newName);
    }
  };
  const userIsTyping = () => {
    console.log("pass");
    socket.emit("send_message", { type: "isTyping" });
    setTimeout(userStopedTyping, 5000);
  };

  const userStopedTyping = () => {
    socket.emit("send_message", { type: "isNotTyping" });
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
        <p className="chat-title">{otherUsername}</p>
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
                    <p
                      className={
                        messageContent.think ? "message-bold" : "message-normal"
                      }
                    >
                      {messageContent.message}
                    </p>
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
        onKeyDown={userIsTyping}
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
      ></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
