import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [] = useState("");

  const joinChat = () => {
    socket.emit("join_chat", "chatroom1");
  };

  return (
    <div className="App">
      <button onClick={joinChat}>Enter in chatroom</button>

      <Chat socket={socket}></Chat>
    </div>
  );
}

export default App;
