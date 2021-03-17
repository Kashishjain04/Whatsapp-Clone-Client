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
import { appInstance as axios } from "../api";
import "../assets/css/Chat.css";
import { selectActiveRoomIndex, selectRooms } from "../redux/roomSlice";
import { selectUser } from "../redux/userSlice";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat() {
  const messagesEndRef = useRef(null),
    [message, setMessage] = useState(""),
    [emoji, setEmoji] = useState(false),
    user = useSelector(selectUser),
    rooms = useSelector(selectRooms),
    activeRoomIndex = useSelector(selectActiveRoomIndex),
    activeRoom = rooms?.[activeRoomIndex];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom]);

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(
        "/new",
        {
          roomID: activeRoom._id,
          message,
          timestamp: new Date().toLocaleString(),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        setMessage("");
      })
      .catch((err) => console.log(err.message));
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
        <Avatar>{activeRoom?.name ? activeRoom.name[0] : "RN"}</Avatar>
        <div className="chat__headerInfo">
          <h3>{activeRoom ? activeRoom.name : "Select a Chat"}</h3>
          <p>{activeRoom?._id}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {activeRoom?.messages.map((message, index) => (
          <React.Fragment key={index}>
            {activeRoom?.messages[index - 1]?.timestamp.split("/")[0] !==
              message.timestamp.split("/")[0] && (
              <span className="chat__centerTimestamp">
                {message.timestamp.split(",")[0]}
              </span>
            )}
            <p
              key={message._id}
              className={`chat__message ${
                message.userId === user._id && "chat__reciever"
              }`}
            >
              <span className="chat__name">{message.userName}</span>
              {message.message}
              <span className="chat__timestamp">
                {message.timestamp.split(", ")[1]}
              </span>
            </p>
          </React.Fragment>
        ))}
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
