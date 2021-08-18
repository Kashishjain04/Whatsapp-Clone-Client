import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateImage: (state, action) => {
      state.user.pic = action.payload;
    },
  },
});

export const { login, logout, updateImage } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectRooms = (state) => state.user.user.rooms;

export default userSlice.reducer;
