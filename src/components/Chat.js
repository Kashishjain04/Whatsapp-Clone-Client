import { Avatar, ClickAwayListener, IconButton } from "@material-ui/core";
import {
  AttachFile,
  SearchOutlined,
  MoreVert,
  InsertEmoticon,
  Mic,
} from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { extraInstance, roomInstance as axios } from "../api";
import "../assets/css/Chat.css";
import { selectActiveRoomIndex, selectRooms } from "../redux/roomSlice";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import ChatMessages from "./ChatMessages";

function Chat({ setAboutRoom }) {
  const messagesEndRef = useRef(null),
    [message, setMessage] = useState(""),
    [emoji, setEmoji] = useState(false),
    rooms = useSelector(selectRooms),
    activeRoomIndex = useSelector(selectActiveRoomIndex),
    activeRoom = rooms?.[activeRoomIndex],
    [sigTimestamp, setSigTimestamp] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom]);

  const getSignature = (callback, params_to_sign) => {
    extraInstance
      .post(
        "/cloudinarySignature",
        { params_to_sign },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(({ data }) => {
        callback(data.signature);
        setSigTimestamp(data.timestamp);
      })
      .catch((err) => console.log(err));
  };

  const messageBackend = (obj) => {
    axios
      .post("/newMessage", obj, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setMessage("");
      })
      .catch((err) => console.log(err.message));
  };

  const myWidget = window.cloudinary?.createUploadWidget(
    {
      cloudName: "kashish",
      uploadPreset: "whatsapp",
      folder: `whatsapp/messages/${activeRoom?._id}/`,
      use_filename: true,
      api_key: process.env.REACT_APP_CLOUDINARY_KEY,
      uploadSignatureTimestamp: sigTimestamp,
      uploadSignature: getSignature,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        messageBackend({
          roomID: activeRoom._id,
          message: result.info.url,
          timestamp: Date.now(),
          type: "img",
        });
      }
    }
  );

  const sendMessage = (e) => {
    e.preventDefault();
    messageBackend({
      roomID: activeRoom._id,
      message,
      timestamp: Date.now(),
      type: "text",
    });
  };

  const emojiPicker = (
    <ClickAwayListener onClickAway={() => setEmoji(false)}>
      <Picker
        set="apple"
        title="Pick your emoji…"
        emoji="point_up"
        onSelect={(e) => setMessage((prev) => prev + e.native)}
        style={{ position: "absolute", bottom: "63px", zIndex: 1 }}
      />
    </ClickAwayListener>
  );

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar onClick={() => setAboutRoom(true)} src={activeRoom?.pic}>
          {activeRoom?.name ? activeRoom.name[0] : "RN"}
        </Avatar>
        <div className="chat__headerInfo">
          <h3>{activeRoom ? activeRoom.name : "Select a Chat"}</h3>
//           <p>{activeRoom?._id}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton onClick={() => myWidget.open()}>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {activeRoom?.messages && (
          <ChatMessages messages={activeRoom.messages} />
        )}
        <div ref={messagesEndRef} />
      </div>
      {activeRoom && (
        <div className="chat__footer">
          {emoji && emojiPicker}
          <IconButton onClick={() => setEmoji((prev) => !prev)}>
            <InsertEmoticon />
          </IconButton>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
          <Mic />
        </div>
      )}
    </div>
  );
}

export default Chat;
