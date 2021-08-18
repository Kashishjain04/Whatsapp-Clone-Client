import React, { useEffect, useState } from "react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Pusher from "pusher-js";
import "../App.css";
import { useDispatch } from "react-redux";
import { newMessage, updateRoomIcon } from "../redux/roomSlice";
import Profile from "./Profile";
import { updateImage } from "../redux/userSlice";
import RoomInfo from "./RoomInfo";

function Home() {
  const dispatch = useDispatch(),
    [profile, setProfile] = useState(false),
    [aboutRoom, setAboutRoom] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    const roomChannel = pusher.subscribe("room");
    const userChannel = pusher.subscribe("user");

    roomChannel.bind("updated", ({ key, newMsg }) => {
      dispatch(newMessage({ key, newMsg }));
    });

    roomChannel.bind("picUpdated", ({ key, picURL }) => {
      dispatch(updateRoomIcon({ key, picURL }));
    });

    userChannel.bind("picUpdated", ({ key, picURL }) => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser._id === key) {
        dispatch(updateImage(picURL));
        localUser.pic = picURL;
        localStorage.setItem("user", JSON.stringify(localUser));
      }
    });

    return () => {
      roomChannel.unbind_all();
      roomChannel.unsubscribe();
      userChannel.unbind_all();
      userChannel.unsubscribe();
    };
  }, []);

  return (
    <div className="app">
      <div className="app__body">
        {profile ? (
          <Profile setProfile={setProfile} />
        ) : (
          <Sidebar setProfile={setProfile} />
        )}
        <Chat setAboutRoom={setAboutRoom} />
        {aboutRoom && <RoomInfo setAboutRoom={setAboutRoom} />}
      </div>
    </div>
  );
}

export default Home;
