import React, { useEffect, useState } from "react";
import "../assets/css/Sidebar.css";
import SidebarChat from "./SidebarChat";
import { Add, Create, MoreVert, SearchOutlined } from "@material-ui/icons";
import { Avatar, IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../redux/userSlice";
import { selectRooms, roomsCleanup } from "../redux/roomSlice";
import { appInstance as axios } from "../api";
import roomActions from "../utils/actions";

function Sidebar({ setProfile }) {
  const user = useSelector(selectUser),
    fetchedRooms = useSelector(selectRooms),
    dispatch = useDispatch(),
    [rooms, setRooms] = useState([]),
    sRooms = fetchedRooms;

  useEffect(() => {
    setRooms(fetchedRooms);
  }, [fetchedRooms]);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(roomsCleanup());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

  const searchRoom = (e) => {
    if (e.target.value) {
      const temp = sRooms?.filter((t) =>
        t?.name.toUpperCase().includes(e.target.value.toUpperCase())
      );
      setRooms(temp);
    } else {
      setRooms(sRooms);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <IconButton
          onClick={() => setProfile(true)}
          className="sidebar__headerAvatar"
        >
          <Avatar src={user.pic ? user.pic : ""} />
        </IconButton>
        <div className="sidebar__headerRight">
          <IconButton onClick={createRoomHandler}>
            <Create title="Create a Room" />
          </IconButton>
          <IconButton onClick={joinRoomHandler}>
            <Add title="Join a Room" />
          </IconButton>
          <IconButton onClick={logoutHandler}>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search" type="text" onChange={searchRoom} />
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
