import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import userContext from "../context/userContext";
import moment from "moment";
import axios from "axios";

const socket = io.connect("http://localhost:4000", { reconnect: true });
// config[process.env.NODE_ENV].endpoint
export default function PrototypePage() {
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const { user, getUser } = useContext(userContext);
  const history = useHistory();

  useEffect(() => {
    //first get all the message data from MongoDB
    async function getMessages() {
      // const res = await axios.get("http://localhost:4000");
      // console.log(res.data);
      // setChatData(res.data);
    }
    getMessages();
    //Connect with server
    socket.on("Output chat message", (messageFromServer) => {
      console.log(messageFromServer); //check if all data is logged out
      //another action to put this output in redux store or state
      setNewMessage(messageFromServer); // then render this message
    });
  }, []);

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

  async function logOut() {
    await axios.get("http://localhost:4000/user/logout");
    getUser();
    history.push("/login");
  }

  return (
    <div>
      <button onClick={logOut}>logout</button>
      <p>Prototype page</p>
      {/* <p>{chatData.chatMessage}</p>
      <p>{newMessage.chatMessage}</p> */}
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
