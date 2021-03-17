import { Avatar, IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authInstance } from "../api";
import "../assets/css/Profile.css";
import { login, selectUser } from "../redux/userSlice";

const Profile = ({ setProfile }) => {
  const user = useSelector(selectUser),
    dispatch = useDispatch();

  const myWidget = window.cloudinary?.createUploadWidget(
    {
      cloudName: "kashish",
      uploadPreset: "whatsapp",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        authInstance
          .put(
            "/profileImage",
            { url: result.info.url },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then(({ data }) => {
            const { _id, name, pic, email, isGoogle } = data;
            dispatch(login({ _id, name, email, pic, isGoogle }));
            localStorage.setItem(
              "user",
              JSON.stringify({ _id, name, email, pic, isGoogle })
            );
          })
          .catch((err) => console.log(err.message));
      }
    }
  );

  const updateName = () => {
    const name = prompt("Enter New Name: ");
    if (name === user.name) {
      return alert("New name is same as the previous name.");
    }
    if (name) {
      authInstance
        .put(
          "/profileName",
          { name },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(({ data }) => {
          const { _id, name, pic, email, isGoogle } = data;
          dispatch(login({ _id, name, email, pic, isGoogle }));
          localStorage.setItem(
            "user",
            JSON.stringify({ _id, name, email, pic, isGoogle })
          );
        })
        .catch((err) => console.log(err.message));
    }
  };

  const deletePic = () => {
    authInstance
      .delete("/profileImage", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        const { _id, name, pic, email, isGoogle } = data;
        dispatch(login({ _id, name, email, pic, isGoogle }));
        localStorage.setItem(
          "user",
          JSON.stringify({ _id, name, email, pic, isGoogle })
        );
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <span onClick={() => setProfile(false)}>&#8592;</span> Profile
      </div>
      <div className="profile__pic">
        <div className="profile__picInner">
          <Avatar src={user.pic ? user.pic : ""} />
          {!user.isGoogle && (
            <div className="profile__picOverlay">
              <IconButton onClick={() => myWidget.open()}>
                <Edit />
              </IconButton>
              {user.pic && (
                <IconButton onClick={deletePic}>
                  <Delete />
                </IconButton>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="profile__name">
        <span>Your Name</span>
        <div className="name">
          <span>{user.name}</span>
          {!user.isGoogle && (
            <IconButton onClick={updateName}>
              <Edit />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
