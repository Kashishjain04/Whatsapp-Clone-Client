import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "./index.css";

console.log("%cWARNING!", "font-size: 40px; color: red; background: #ffdf65");
console.log(
  "%cUsing this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS.\nDo not enter or paste code that you do not understand.",
  "font-size: 20px;"
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
