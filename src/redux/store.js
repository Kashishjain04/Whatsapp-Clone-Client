import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
  devTools: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
  middleware: [...getDefaultMiddleware({ immutableCheck: false })],
});
