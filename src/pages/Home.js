import React, { useEffect, useState } from "react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Pusher from "pusher-js";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { selectRooms, setActiveRoomIndex, setRooms } from "../redux/roomSlice";

function Home() {
  const dispatch = useDispatch(),
    rooms = useSelector(selectRooms);

  useEffect(() => {
    var pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("room");
    channel.bind("updated", ({ key, room }) => {
      const tRooms = [...rooms];
      for (let i = 0; i < tRooms?.length; i++) {
        if (tRooms[i]._id == key && room) {
          tRooms[i] = room;
          dispatch(setRooms(tRooms));
          break;
        }
      }
    });
    channel.bind("inserted", ({ room }) => {
      const tRooms = [...rooms, room];
      dispatch(setRooms(tRooms));
      dispatch(setActiveRoomIndex(tRooms.length - 1));
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [rooms]);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
