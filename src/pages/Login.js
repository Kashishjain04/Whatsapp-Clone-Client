import { Button, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { SnackbarProvider } from "notistack";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../assets/css/Login.css";

const Login = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false),
    [signupModalVisible, setSignupModalVisible] = useState(false);

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
