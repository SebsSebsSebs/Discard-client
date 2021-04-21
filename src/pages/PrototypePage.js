import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import userContext from "../context/userContext";
// import moment from "moment";
import axios from "axios";

const socket = io.connect("http://localhost:4000", { reconnect: true });
// config[process.env.NODE_ENV].endpoint
export default function PrototypePage() {
  const [message, setMessage] = useState("");
  // const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState([]);

  const { user, getUser, userInformation, getUserProfile } = useContext(
    userContext
  );
  const history = useHistory();
  console.log("prototypepage user infromation:", userInformation);
  useEffect(() => {
    //first get all the message data from MongoDB
    async function getMessages() {
      // const res = await axios.get("http://localhost:4000");
      // console.log(res.data);
      // setChatData(res.data);
    }
    getMessages();
    const messages = [];
    socket.on("Output chat message", (messageFromServer) => {
      console.log(messageFromServer); //check if all data is logged out
      //another action to put this output in redux store or state
      messages.push(messageFromServer);
      setNewMessage([...newMessage, messageFromServer]); // then render this message
    });

    //Connect with server
  }, [newMessage]);

  const sendMessage = (e) => {
    e.preventDefault();
    // const userId = 4; //get user data from state
    // const userName = "seb"; //get user data from state
    // const userImage = "testURL"; //get user data from state
    // const nowTime = moment();
    // const type = "text"; // type of the message
    // const chatMessage = message; //the message written
    const text = message;
    const channelId = 1;
    const isImg = false;
    const userId = user;

    socket.emit("Input chat message", {
      //things you want to send to the server
      // userId,
      // userName,
      // userImage,
      // nowTime,
      // type,
      // chatMessage,
      text,
      channelId,
      isImg,
      userId,
      userName: userInformation.username,
    });
    setMessage("");
  };

  async function logOut() {
    await axios.get("http://localhost:4000/user/logout");
    getUser();
    getUserProfile();
    history.push("/login");
  }

  return (
    <div>
      <button onClick={logOut}>logout</button>
      <p>Prototype page</p>
      {/* <p>{chatData.chatMessage}</p>*/}
      {newMessage ? (
        newMessage.map((msg, index) =>
          msg.userId === user ? (
            <>
              <p key={index} style={{ textAlign: "right" }}>
                {msg.userName}:{msg.text}
              </p>
            </>
          ) : (
            <>
              <p key={index} style={{ textAlign: "left" }}>
                {msg.userName}:{msg.text}
              </p>
            </>
          )
        )
      ) : (
        <></>
      )}

      <form onSubmit={sendMessage}>
        <label>Message:</label>
        <br></br>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
