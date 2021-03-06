import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { setRooms } from "../redux/roomSlice";
import { Button } from "@material-ui/core";
import { authInstance as axios } from "../api/index";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

const LoginForm = () => {
  const dispatch = useDispatch(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    { enqueueSnackbar } = useSnackbar();

  const loginHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "/signin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(({ data }) => {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        const { _id, name, email } = data.user;
        dispatch(login({ _id, name, email }));
        dispatch(setRooms(data.user?.rooms));
      })
      .catch(({ response }) => {
        if (response) {
          enqueueSnackbar(response?.data.error, { variant: "error" });
        }
      });
  };

  return (
    <form className="login__form" onSubmit={loginHandler}>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default LoginForm;
