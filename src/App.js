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

  const storedUser = localStorage.getItem("user");
  useEffect(async () => {
    if (storedUser) {
      const rooms = await roomActions.getUserRooms();
      dispatch(setRooms(rooms));
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [storedUser]);

  return <div>{user ? <Home /> : <Login />}</div>;
}

export default App;
