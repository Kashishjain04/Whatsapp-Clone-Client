import { appInstance as axios } from "../api";

const roomActions = {
  getUserRooms: async () => {
    return await axios
      .get("/getUserData", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(({ data }) => data.rooms)
      .catch((err) => console.log(err.message));
  },
};

export default roomActions;
