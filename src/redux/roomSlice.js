import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
  name: "user",
  initialState: {
    rooms: null,
    activeRoomIndex: 0,
  },
  reducers: {
    setActiveRoomIndex: (state, action) => {
      state.activeRoomIndex = action.payload;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    roomsCleanup: (state) => {
      state.activeRoomIndex = null;
      state.rooms = null;
    },
  },
});

export const { setActiveRoomIndex, setRooms, roomsCleanup } = roomSlice.actions;

export const selectActiveRoomIndex = (state) => state.room.activeRoomIndex;
export const selectRooms = (state) => state.room.rooms;

export default roomSlice.reducer;
