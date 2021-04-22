import React, { useState, useEffect, useContext } from "react";
import ChannelsRender from "../components/ChannelsRender";
import { Button, Input } from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Link } from "react-router-dom";
import userContext from "../context/userContext";

// modalStyle
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ChannelPage() {
  const { logOut } = useContext(userContext);
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState("");
  //modal
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={channelCreate}>
        <Input
          type="text"
          placeholder="channel name"
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
        />
        <Button type="submit">create</Button>
      </form>
    </div>
  );

  useEffect(() => {
    getData();
  }, []);

  async function channelCreate() {
    const channelData = {
      channelName: newChannel,
    };
    try {
      await axios.post("http://localhost:4000/channel/", channelData);
    } catch (err) {
      return;
    }
    getData();
  }

  async function getData() {
    const response = await axios.get(`http://localhost:4000/channel/`);
    setChannels(response.data);
  }

  return (
    <div>
      <button onClick={logOut}>logout</button>
      <h1>this is channel page</h1>
      {/* channel section */}
      {/* create channels */}

      <Button type="button" onClick={handleOpen}>
        create channel
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>

      {/* map out channels  */}
      {channels.map((channelInfo, index) => (
        <div key={index}>
          <Link to={`/messages/${channelInfo._id}`}>
            <h1>{channelInfo.channelName}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ChannelPage;
