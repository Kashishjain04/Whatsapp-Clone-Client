import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
});
