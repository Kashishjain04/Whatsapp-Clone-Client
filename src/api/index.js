import axios from "axios";

const appURL = "https://whatsapp04-backend.herokuapp.com/messages";
const authURL = "https://whatsapp04-backend.herokuapp.com/auth";

export const appInstance = axios.create({ baseURL: appURL });
export const authInstance = axios.create({ baseURL: authURL });
