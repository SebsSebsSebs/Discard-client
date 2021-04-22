import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import userContext from "../context/userContext";
import axios from "axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const socket = io.connect("http://localhost:4000", { reconnect: true });

export default function PrototypePage() {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [messagesFromDB, setMessagesFromDB] = useState([]);

  const { user, logOut, userInformation } = useContext(userContext);
  const route_params = useParams();
  const route_channelId = route_params.channelId;

  console.log(typeof route_channelId);

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
      const response = await axios.get(
        `http://localhost:4000/message/${route_channelId}`
      );
      if (Array.isArray(response.data)) {
        setMessagesFromDB(response.data);
      }
      console.log("response with all messages:", response.data);
    }
    getData();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    const text = message;
    const channelId = route_channelId;
    const isImg = false;
    const userId = user;

    socket.emit("Input chat message", {
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
      <Link to="/">
        <button>Go back</button>
      </Link>
      <button onClick={logOut}>logout</button>
      <p>Prototype page</p>

      {messagesFromDB.length ? (
        messagesFromDB.map((msg, index) =>
          msg.userId._id === user ? (
            <div key={index}>
              <p style={{ textAlign: "right" }}>
                {msg.userId.username}:{msg.text}
              </p>
            </div>
          ) : (
            <div key={index}>
              <p style={{ textAlign: "left" }}>
                {msg.userId.username}:{msg.text}
              </p>
            </div>
          )
        )
      ) : (
        <></>
      )}
      {newMessage.length ? (
        newMessage.map((msg, index) =>
          msg.userId === user ? (
            <div key={index}>
              <p style={{ textAlign: "right" }}>
                {msg.userName}:{msg.text}
              </p>
            </div>
          ) : (
            <div key={index}>
              <p style={{ textAlign: "left" }}>
                {msg.userName}:{msg.text}
              </p>
            </div>
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
