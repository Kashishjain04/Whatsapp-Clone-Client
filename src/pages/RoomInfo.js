import { Avatar, IconButton } from "@material-ui/core";
import { Clear, Delete, Edit } from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { roomInstance as axios, extraInstance } from "../api";
import "../assets/css/RoomInfo.css";
import { selectActiveRoomIndex, selectRooms } from "../redux/roomSlice";

const RoomInfo = ({ setAboutRoom }) => {
  const rooms = useSelector(selectRooms),
    activeRoomIndex = useSelector(selectActiveRoomIndex),
    activeRoom = rooms?.[activeRoomIndex],
    [sigTimestamp, setSigTimestamp] = useState(0);

  const getSignature = (callback, params_to_sign) => {
    extraInstance
      .post(
        "/cloudinarySignature",
        { params_to_sign },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(({ data }) => {
        callback(data.signature);
        setSigTimestamp(data.timestamp);
      })
      .catch((err) => console.log(err));
  };

  const myWidget = window.cloudinary?.createUploadWidget(
    {
      cloudName: "kashish",
      uploadPreset: "whatsapp",
      public_id: `rooms/${activeRoom._id}`,
      api_key: process.env.REACT_APP_CLOUDINARY_KEY,
      uploadSignatureTimestamp: sigTimestamp,
      uploadSignature: getSignature,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        axios
          .put(
            "/profileImage",
            { url: result.info.url, roomId: activeRoom._id },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .catch((err) => console.log(err.message));
      }
    }
  );

  const deletePic = () => {
    axios
      .delete("/profileImage", {
        data: { roomId: activeRoom._id },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="roomInfo">
      <div className="roomInfo__header">
        <IconButton onClick={() => setAboutRoom(false)}>
          <Clear />
        </IconButton>
        <span>Room Info</span>
      </div>
      <div className="roomInfo__body">
        <div className="roomInfo__pic">
          <div className="roomInfo__picInner">
            <Avatar src={activeRoom?.pic}>
              {activeRoom?.name ? activeRoom.name[0] : "RN"}
            </Avatar>
            <div className="roomInfo__picOverlay">
              <IconButton onClick={() => myWidget.open()}>
                <Edit />
              </IconButton>
              {activeRoom?.pic && (
                <IconButton onClick={deletePic}>
                  <Delete />
                </IconButton>
              )}
            </div>
          </div>
        </div>
        <div className="roomInfo__name">{activeRoom.name}</div>
      </div>
    </div>
  );
};

export default RoomInfo;
