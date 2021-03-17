import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import { authInstance as axios } from "../api/index";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

const SignupForm = () => {
  const dispatch = useDispatch(),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    { enqueueSnackbar } = useSnackbar();

  const signupHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "/signup",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(({ data }) => {
        const { _id, name, pic, email, isGoogle } = data?.user;
        localStorage.setItem("token", data?.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ _id, name, pic, email, isGoogle })
        );
        dispatch(login({ _id, name, pic, email, isGoogle }));
      })
      .catch(({ response }) => {
        if (response) {
          enqueueSnackbar(response?.data.error, { variant: "error" });
        }
      });
  };

  return (
    <form className="login__form" onSubmit={signupHandler}>
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
        minLength="6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default SignupForm;
