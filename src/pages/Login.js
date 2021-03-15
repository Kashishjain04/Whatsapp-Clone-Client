import { Button, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { SnackbarProvider } from "notistack";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../assets/css/Login.css";
import GoogleLogin from "react-google-login";
import { authInstance } from "../api";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { setRooms } from "../redux/roomSlice";

const Login = () => {
  const dispatch = useDispatch(),
    [loginModalVisible, setLoginModalVisible] = useState(false),
    [signupModalVisible, setSignupModalVisible] = useState(false);

  const googleSuccess = (res) => {
    const profile = res?.profileObj;
    const obj = {
      name: profile.name,
      email: profile.email,
      pic: profile.imageUrl,
      googleId: profile.googleId,
    };
    authInstance
      .post("/googleLogin", obj)
      .then(({ data }) => {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        dispatch(login(data.user));
        dispatch(setRooms(data.user?.rooms));
      })
      .catch(({ response }) => {
        if (response) {
          console.log(response?.data.error);
        }
      });
  };
  const googleFailure = (err) => console.log(err);

  return (
    <div className="login">
      <div className="login__logo">
        <img width="250px" alt="logo" src="/icon.png" />
        <h1 className="logo__text">Whatsapp</h1>
      </div>
      <div className="login__buttons">
        <Button
          onClick={() => setLoginModalVisible(true)}
          variant="contained"
          color="primary"
        >
          Login
        </Button>
        OR
        <Button
          onClick={() => setSignupModalVisible(true)}
          variant="contained"
          color="secondary"
        >
          Signup
        </Button>
      </div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={googleSuccess}
        onFailure={googleFailure}
        cookiePolicy={"single_host_origin"}
      />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Modal
          open={loginModalVisible}
          onClose={() => setLoginModalVisible(false)}
          aria-labelledby="add-customer"
          aria-describedby="simple-modal-description"
        >
          <LoginForm />
        </Modal>
        <Modal
          open={signupModalVisible}
          onClose={() => setSignupModalVisible(false)}
          aria-labelledby="add-customer"
          aria-describedby="simple-modal-description"
        >
          <SignupForm />
        </Modal>
      </SnackbarProvider>
    </div>
  );
};

export default Login;
