import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { setRooms } from "./redux/roomSlice";
import { login, selectUser } from "./redux/userSlice";
import roomActions from "./utils/actions";

function App() {
  const user = useSelector(selectUser),
    dispatch = useDispatch(),
    [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  useEffect(async () => {
    if (storedUser) {
      const rooms = await roomActions.getUserRooms();
      dispatch(setRooms(rooms));
      dispatch(login(JSON.parse(storedUser)));
    }
    setLoading(false);
  }, [storedUser]);

  return loading ? (
    <div className="loader">
      <LinearProgress />
    </div>
  ) : user ? (
    <Home />
  ) : (
    <Login />
  );
}

export default App;
