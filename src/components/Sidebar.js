import React, { useEffect, useState } from "react";
import "../assets/css/Sidebar.css";
import SidebarChat from "./SidebarChat";
import { Add, Create, ExitToApp, SearchOutlined } from "@material-ui/icons";
import { Avatar, IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../redux/userSlice";
import {
  selectRooms,
  roomsCleanup,
  setActiveRoomIndex,
  setRooms,
  selectActiveRoomIndex,
} from "../redux/roomSlice";
import { roomInstance as axios } from "../api";

function Sidebar({ setProfile }) {
  const user = useSelector(selectUser),
    fetchedRooms = useSelector(selectRooms),
    dispatch = useDispatch(),
    [rooms, setLocalRooms] = useState([]),
    activeRoomIndex = useSelector(selectActiveRoomIndex);

  // Set current room as active in sidebar
  useEffect(() => {
    const sidebarRooms = document.querySelectorAll(".sidebarChat");
    if (sidebarRooms) {
      sidebarRooms.forEach((t) => t?.classList?.remove("active"));
      sidebarRooms[activeRoomIndex]?.classList?.add("active");
    }
  });

  useEffect(() => {
    setLocalRooms(fetchedRooms);
  }, [fetchedRooms]);

  const logoutHandler = () => {
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      dispatch(roomsCleanup());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
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
        .then(({ data }) => {
          const tRooms = [...fetchedRooms, data];
          dispatch(setRooms(tRooms));
          dispatch(setActiveRoomIndex(tRooms.length - 1));
        });
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
        .then(({ data }) => {
          const tRooms = [...fetchedRooms, data];
          dispatch(setRooms(tRooms));
          dispatch(setActiveRoomIndex(tRooms.length - 1));
        })
        .catch((err) => console.log(err.message));
    }
  };

  const searchRoom = (e) => {
    if (e.target.value) {
      const temp = fetchedRooms?.filter((t) =>
        t?.name.toUpperCase().includes(e.target.value.toUpperCase())
      );
      setLocalRooms(temp);
    } else {
      setLocalRooms(fetchedRooms);
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
            <ExitToApp />
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
