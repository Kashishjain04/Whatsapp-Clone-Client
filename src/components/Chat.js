import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  SearchOutlined,
  MoreVert,
  InsertEmoticon,
  Mic,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { appInstance as axios } from "../api";
import "../assets/css/Chat.css";
import { selectActiveRoomIndex, selectRooms } from "../redux/roomSlice";
import { selectUser } from "../redux/userSlice";

function Chat() {
  const [message, setMessage] = useState(""),
    user = useSelector(selectUser),
    rooms = useSelector(selectRooms),
    activeRoomIndex = useSelector(selectActiveRoomIndex);

  const activeRoom = rooms?.[activeRoomIndex];

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

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar>{activeRoom ? activeRoom.name[0] : "RN"}</Avatar>
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
          <>
            {activeRoom?.messages[index - 1]?.timestamp.split("/")[0] !==
              message.timestamp.split("/")[0] && (
              <span className="chat__centerTimestamp">
                {message.timestamp.split(",")[0]}
              </span>
            )}
            <p
              key={message._id}
              className={`chat__message ${
                message.user?._id === user._id && "chat__reciever"
              }`}
            >
              <span className="chat__name">{message.user?.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {message.timestamp.split(", ")[1]}
              </span>
            </p>
          </>
        ))}
      </div>
      {activeRoom && (
        <div className="chat__footer">
          <InsertEmoticon />
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
