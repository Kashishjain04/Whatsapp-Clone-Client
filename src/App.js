import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { setRooms } from "./redux/roomSlice";
import { login, selectUser } from "./redux/userSlice";
import roomActions from "./utils/actions";

function App() {
  const user = useSelector(selectUser),
    dispatch = useDispatch();

  useEffect(async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(login(JSON.parse(storedUser)));
      const rooms = await roomActions.getUserRooms();
      dispatch(setRooms(rooms));
    }
  }, []);

  return <div>{user ? <Home /> : <Login />}</div>;
}

export default App;
