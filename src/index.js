import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import RolesState from "./contexts/rolesContext/RolesState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RolesState>
      <App />
    </RolesState>
  </React.StrictMode>,
);
