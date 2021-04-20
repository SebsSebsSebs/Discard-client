import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import moment from "moment";
import axios from "axios";

const socket = io("hhtp://localhost:4000");

export default function PrototypePage() {
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState(null)

  useEffect(() => {
    //first get all the message data from MongoDB
    const res = await axios.get("url")
    console.log(res.data)
    setChatData(res.data)
    //Connect with server
    socket.on("Output chat message", (messageFromServer) => {
      console.log(messageFromServer); //check if all data is logged out
      //another action to put this output in redux store or state
      setNewMessage(messageFromServer) // then render this message 
    });
  });

  const sendMessage = (e) => {
    e.preventDefault();
    const userId = 4; //get user data from state
    const userName = "test"; //get user data from state
    const userImage = "testURL"; //get user data from state
    const nowTime = moment();
    const type = "text"; // type of the message
    const chatMessage = message; //the message written

    socket.emit("Input chat message", {
        //things you want to send to the server
      userId, 
      userName,
      userImage,
      nowTime,
      type,
      chatMessage,
    });
    setMessage("");
  };

  return (
    <div>
      <p>Prototype page</p>
      {/* <p>{chatData.chatMessage}</p> //showing all the message logs */}
      {/* <p>{newMessage.chatMessage}</p> */}
      <form onSubmit={sendMessage}>
        <label>Message:</label>
        <br></br>
        <textarea
          type="textarea"
          rows="4"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
