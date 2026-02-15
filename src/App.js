import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { lightTheme, darkTheme } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import { CustomThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Lazy loaded components
const Dashboard = lazy(() => import("./pages/Main/Dashboard"));
const ToDoPage = lazy(() => import("./pages/Main/ToDo"));
const CalendarPage = lazy(() => import("./pages/Main/CalendarPage"));
const NotificationsPage = lazy(() => import("./pages/Main/Notifications"));
const Classroom = lazy(() => import("./pages/Classroom/Classroom"));
const ClassroomStream = lazy(() => import("./pages/Classroom/ClassroomStream"));
const ClassroomChat = lazy(() => import("./pages/Classroom/ClassroomChat"));
const ClassroomPeople = lazy(() => import("./pages/Classroom/ClassroomPeople"));



const GradesPage = lazy(() => import("./pages/Gradebook/Gradespage"));
const ProfileSettings = lazy(() => import("./pages/Settings/ProfileSettings"));
const AccountSettings = lazy(() => import("./pages/Settings/AccountSettings"));


const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem("bq-theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("bq-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("bq-theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <CustomThemeProvider value={{ darkMode, toggleTheme }}>
          <AuthProvider>
            <NotificationProvider>
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <Routes>
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/todo" element={<ToDoPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                      />

                      {/* Classroom nested routes */}
                      <Route path="/classroom/:id" element={<Classroom />}>
                        <Route
                          index
                          element={<Navigate to="stream" replace />}
                        />
                        <Route path="stream" element={<ClassroomStream />} />
                        <Route path="people" element={<ClassroomPeople />} />
                        <Route path="chat" element={<ClassroomChat />} />
                      </Route>

                      {/* Grades (card view) - linked from sidebar */}
                      <Route path="/grades" element={<GradesPage />} />

                      {/* Settings */}
                      <Route path="/settings">
                        <Route path="profile" element={<ProfileSettings />} />
                        <Route path="account" element={<AccountSettings />} />
                      </Route>

                    </Route>
                  </Route>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </NotificationProvider>
          </AuthProvider>
        </CustomThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: darkMode ? "#1e293b" : "#ffffff",
              color: darkMode ? "#f8fafc" : "#0f172a",
            },
          }}
        />
      </ThemeProvider>
    </Router>
  );
}

export default App;
