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

  const parseMessage = (message) => {
    return message?.length > 25 ? message?.substring(0, 25) + "..." : message;
  };

  return (
    <div id={room._id} onClick={dispatchRoom} className="sidebarChat">
      <Avatar src={room?.pic}>{room?.name ? room.name[0] : "RN"}</Avatar>
      <div className="sidebarChat__info">
        <h2>{room.name}</h2>
        {room?.messages && room.messages.length !== 0 ? (
          <span>
            <h4>{room?.messages[room?.messages?.length - 1]?.userName}: </h4>
            {room?.messages[room?.messages?.length - 1]?.type === "img"
              ? "Image"
              : parseMessage(
                  room?.messages[room?.messages?.length - 1]?.message
                )}
          </span>
        ) : (
          <p>No Messages</p>
        )}
      </div>
    </div>
  );
}

export default SidebarChat;
