import { Avatar } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { setActiveRoomIndex } from "../redux/roomSlice";
import "../assets/css/SidebarChat.css";

function SidebarChat({ room, index }) {
  const dispatch = useDispatch();

  const dispatchRoom = () => {
    dispatch(setActiveRoomIndex(index));
  };

  return (
    <div onClick={dispatchRoom} className="sidebarChat">
      <Avatar>RN</Avatar>
      <div className="sidebarChat__info">
        <h2>{room.name}</h2>
        <p>
          <h4>{room.messages[room.messages.length - 1].user.name}: </h4>
          {room.messages[room.messages.length - 1].message}
        </p>
      </div>
    </div>
  );
}

export default SidebarChat;
