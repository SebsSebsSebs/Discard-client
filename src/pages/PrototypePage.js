import React, { useEffect, useState, useContext, useCallback } from "react";
import { io } from "socket.io-client";
import userContext from "../context/userContext";
import axios from "axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { TextField, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import moment from "moment";

const socket = io.connect("http://localhost:4000", { reconnect: true });

export default function PrototypePage() {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [messagesFromDB, setMessagesFromDB] = useState([]);
  const [deletedMessage, setDeletedMessage] = useState(false);

  const { user, logOut, userInformation } = useContext(userContext);
  const route_params = useParams();
  const route_channelId = route_params.channelId;

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const now = moment().format("h:mm a");

  useEffect(() => {
    const messages = [];
    socket.on("Output chat message", (messageFromServer) => {
      console.log(messageFromServer);
      messages.push(messageFromServer);
      setNewMessage([...newMessage, messageFromServer]);
    });
  }, [newMessage]);

  socket.on("Done deleting chat message", (msg) => {
    const isDeleted = msg === "true" ? true : false;
    if (deletedMessage) {
      setDeletedMessage(!isDeleted);
    } else {
      setDeletedMessage(isDeleted);
    }
  });

  socket.on("Done deleting", (i) => {
    const newArray = [...newMessage];

    newArray.splice(i);
    setNewMessage(newArray);
  });

  function removeMessageOnIndex(i, id) {
    socket.emit("Delete", {
      messageId: id,
      index: i,
    });
  }

  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `http://localhost:4000/message/${route_channelId}`
      );
      if (Array.isArray(response.data)) {
        setMessagesFromDB(response.data);
      }
    }
    getData();
  }, [deletedMessage]);

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

  const deleteClicked = (id) => {
    socket.emit("Delete chat message", {
      messageId: id,
    });
  };

  return (
    <div>
      <Link to="/">
        <button className="goBack">Back to channels</button>
      </Link>
      <p style={{ color: "azure", fontWeight: "bold" }}>*Channel</p>
      <div className="ChatBox">
        <div className="test">
          {messagesFromDB.length ? (
            messagesFromDB.map((msg, index) =>
              msg.userId._id === user ? (
                <div className="Pim">
                  <div
                    className="fixbutton"
                    key={index}
                    ref={messagesFromDB ? setRef : null}
                  >
                    <p style={{ textAlign: "right" }}>{msg.text}</p>

                    <HighlightOffIcon
                      className="button"
                      onClick={() => deleteClicked(msg._id)}
                    />
                  </div>
                  <div>
                    <p className="rightenter">
                      {moment(msg.createdAt).format("h:mm a")}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={index}>
                  <div className="LeftPim">
                    <p style={{ textAlign: "left" }}>
                      <span style={{ color: "purple" }}>
                        {msg.userId.username}
                      </span>
                      :{msg.text}
                    </p>
                    <div className="enter">
                      <p>{moment(msg.createdAt).format("h:mm a")}</p>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <></>
          )}
          {newMessage.length ? (
            newMessage.map((msg, index) =>
              msg.userId === user ? (
                <div key={index} ref={newMessage ? setRef : null}>
                  <p style={{ textAlign: "right" }}>{msg.text}</p>
                  <HighlightOffIcon
                    className="button"
                    onClick={() => removeMessageOnIndex(index, msg._id)}
                  />
                  <div className="rightenter">
                    <p>{moment(msg.createdAt).format("h:mm a")}</p>
                  </div>
                </div>
              ) : (
                <div key={index}>
                  <p style={{ textAlign: "left" }}>
                    {msg.userName}:{msg.text}
                  </p>
                  <div className="enter">
                    <p>{moment(msg.createdAt).format("h:mm a")}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <></>
          )}
        </div>
      </div>
      <form onSubmit={sendMessage} className="RenaForm">
        <TextField
          className="Rena"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Type your message..."
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
        >
          send
        </Button>
      </form>
    </div>
  );
}
