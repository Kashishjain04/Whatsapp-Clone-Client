import axios from "axios";

//Local
// const appURL = "http://localhost:8080/messages";
// const authURL = "http://localhost:8080/auth";

// Hosted
const appURL = "https://whatsapp04-backend.herokuapp.com/messages";
const authURL = "https://whatsapp04-backend.herokuapp.com/auth";

export const appInstance = axios.create({ baseURL: appURL });
export const authInstance = axios.create({ baseURL: authURL });
