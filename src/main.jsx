import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import "./main.css";
import { AuthProvider } from "./context/AuthContext";
import RolesState from "./context/rolesContext/RolesState.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RolesState>
          <App />
        </RolesState>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
