import axios from "axios";

//Local
// const roomURL = "http://localhost:8080/rooms";
// const authURL = "http://localhost:8080/auth";
// const extraURL = "http://localhost:8080/extras";

// Hosted
const roomURL = "https://whatsapp04-backend.herokuapp.com/rooms";
const authURL = "https://whatsapp04-backend.herokuapp.com/auth";
const extraURL = "https://whatsapp04-backend.herokuapp.com/extras";

export const roomInstance = axios.create({ baseURL: roomURL });
export const authInstance = axios.create({ baseURL: authURL });
export const extraInstance = axios.create({ baseURL: extraURL });
