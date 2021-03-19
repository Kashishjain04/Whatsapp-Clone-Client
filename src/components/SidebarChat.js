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
      <Avatar src={room?.pic}>{room?.name ? room.name[0] : "RN"}</Avatar>
      <div className="sidebarChat__info">
        <h2>{room.name}</h2>
        {room?.messages && room.messages.length !== 0 ? (
          <span>
            <h4>{room?.messages[room?.messages?.length - 1]?.userName}: </h4>
            {room?.messages[room?.messages?.length - 1]?.message}
          </span>
        ) : (
          <p>No Messages</p>
        )}
      </div>
    </div>
  );
}

export default SidebarChat;
