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
import { roomInstance as axios } from "../api";
import "../assets/css/Chat.css";
import { selectActiveRoomIndex, selectRooms } from "../redux/roomSlice";
import { selectUser } from "../redux/userSlice";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat({ setAboutRoom }) {
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
        "/newMessage",
        {
          roomID: activeRoom._id,
          message,
          timestamp: Date.now(),
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
        <Avatar onClick={() => setAboutRoom(true)} src={activeRoom?.pic}>
          {activeRoom?.name ? activeRoom.name[0] : "RN"}
        </Avatar>
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
            {new Date(
              activeRoom?.messages[index - 1]?.timestamp
            ).toDateString() !== new Date(message.timestamp).toDateString() && (
              <span className="chat__centerTimestamp">
                {new Date(message.timestamp).toLocaleDateString() ===
                new Date().toLocaleDateString()
                  ? "TODAY"
                  : new Date(message.timestamp).toLocaleDateString()}
              </span>
            )}
            <p
              key={message._id}
              className={`chat__message ${
                message.userId === user._id && "chat__reciever"
              }`}
            >
              {message.userId !== user._id && (
                <span className="chat__name">{message.userName}</span>
              )}
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
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
