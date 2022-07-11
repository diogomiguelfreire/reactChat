import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [showChat, setShowChat] = useState(false);

  const joinChat = () => {
    socket.emit("join_chat", "chatroom1");
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div>
          <button onClick={joinChat}>Enter in chatroom</button>
        </div>
      ) : (
        <Chat chatroom="chatroom1" socket={socket}></Chat>
      )}
    </div>
  );
}

export default App;
