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
    newMessage: (state, action) => {
      const { key, newMsg } = action.payload;

      for (let i = 0; i < state.rooms?.length; i++) {
        if (state.rooms[i]._id === key && newMsg) {
          state.rooms[i].messages.push(newMsg);
          break;
        }
      }
    },
    updateRoomIcon: (state, action) => {
      const { key, picURL } = action.payload;

      for (let i = 0; i < state.rooms?.length; i++) {
        if (state.rooms[i]._id === key) {
          state.rooms[i].pic = picURL;
          break;
        }
      }
    },
    roomsCleanup: (state) => {
      state.activeRoomIndex = null;
      state.rooms = null;
    },
  },
});

export const {
  setActiveRoomIndex,
  setRooms,
  newMessage,
  updateRoomIcon,
  roomsCleanup,
} = roomSlice.actions;

export const selectActiveRoomIndex = (state) => state.room.activeRoomIndex;
export const selectRooms = (state) => state.room.rooms;

export default roomSlice.reducer;
