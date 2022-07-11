import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinChat = () => {
    if (username !== "") {
      socket.emit("join_chat", "chatroom1");
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button onClick={joinChat}>Enter in chatroom</button>
        </div>
      ) : (
        <Chat chatroom="chatroom1" socket={socket}></Chat>
      )}
    </div>
  );
}

export default App;
