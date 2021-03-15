import React from "react";
import "../assets/css/Sidebar.css";
import SidebarChat from "./SidebarChat";
import { Add, Create, MoreVert, SearchOutlined } from "@material-ui/icons";
import { Avatar, IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../redux/userSlice";
import { selectRooms, setRooms, roomsCleanup } from "../redux/roomSlice";
import { appInstance as axios } from "../api";
import roomActions from "../utils/actions";

function Sidebar() {
  const user = useSelector(selectUser),
    rooms = useSelector(selectRooms),
    dispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    dispatch(roomsCleanup());
  };

  const createRoomHandler = () => {
    const roomName = prompt("Room Name:");
    if (roomName) {
      axios
        .post(
          "/createRoom",
          { roomName },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .catch((err) => console.log(err.message));
    }
  };

  const joinRoomHandler = () => {
    const roomID = prompt("Room ID:");
    if (roomID) {
      axios
        .post(
          "/joinRoom",
          { roomID },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(async () => {
          const rooms = await roomActions.getUserRooms();
          dispatch(setRooms(rooms));
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <IconButton onClick={logoutHandler} className="sidebar__headerAvatar">
          <Avatar src={user.pic ? user.pic : ""} />
        </IconButton>
        <h3>{user.name}</h3>
        <div className="sidebar__headerRight">
          <IconButton onClick={createRoomHandler}>
            <Create title="Create a Room" />
          </IconButton>
          <IconButton onClick={joinRoomHandler}>
            <Add title="Join a Room" />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        {rooms?.map((room, index) => (
          <SidebarChat key={index} room={room} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
