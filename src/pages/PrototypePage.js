import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import userContext from "../context/userContext";
import axios from "axios";

const socket = io.connect("http://localhost:4000", { reconnect: true });

export default function PrototypePage() {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [messagesFromDB, setMessagesFromDB] = useState([]);

  const { user, logOut, userInformation } = useContext(userContext);

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

  useEffect(() => {
    async function getData() {
      const channelId = 1;
      const response = await axios.get(
        `http://localhost:4000/message/${channelId}`
      );
      console.log("response with all messages:", response.data);
      setMessagesFromDB(response.data);
    }
    getData();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    const text = message;
    const channelId = 1;
    const isImg = false;
    const userId = user;

    socket.emit("Input chat message", {
      //things you want to send to the server

      text,
      channelId,
      isImg,
      userId,
      userName: userInformation.myProfile[0].username,
    });
    setMessage("");
  };

  return (
    <div>
      <button onClick={logOut}>logout</button>
      <p>Prototype page</p>

      {messagesFromDB ? (
        messagesFromDB.map((msg, index) =>
          msg.userId._id === user ? (
            <>
              <p key={index} style={{ textAlign: "right" }}>
                {msg.userId.username}:{msg.text}
              </p>
            </>
          ) : (
            <>
              <p key={index} style={{ textAlign: "left" }}>
                {msg.userId.username}:{msg.text}
              </p>
            </>
          )
        )
      ) : (
        <></>
      )}
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
