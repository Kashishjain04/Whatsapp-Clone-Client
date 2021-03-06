import React, { useEffect, useState } from "react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Pusher from "pusher-js";
import { appInstance as axios } from "../api/index";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { selectRooms, setRooms } from "../redux/roomSlice";
import roomActions from "../utils/actions";

function Home() {
  const dispatch = useDispatch(),
    [messages, setMessages] = useState([]),
    rooms = useSelector(selectRooms);

  useEffect(() => {
    axios
      .get("/sync", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  }, []);

  useEffect(() => {
    var pusher = new Pusher("2d590458214a61134be0", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("room");
    channel.bind("updated", async ({ key }) => {
      let found = false;
      rooms?.forEach((room) => {
        if (room._id === key) found = true;
      });
      if (found) {
        const userRooms = await roomActions.getUserRooms();
        dispatch(setRooms(userRooms));
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

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
