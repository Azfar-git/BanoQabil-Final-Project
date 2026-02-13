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
import { CustomThemeProvider } from "./context/ThemeContext"; // Updated import name
import { NotificationProvider } from "./context/NotificationContext";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Lazy loaded components
const Dashboard = lazy(() => import("./pages/Main/Dashboard"));
const ToDoPage = lazy(() => import("./pages/Main/ToDo"));
const CalendarPage = lazy(() => import("./pages/Main/CalendarPage"));
const NotificationsPage = lazy(() => import("./pages/Main/Notifications"));
const ClassroomStream = lazy(() => import("./pages/Classroom/ClassroomStream"));
const ClassroomWork = lazy(() => import("./pages/Classroom/ClassroomWork"));
const ClassroomPeople = lazy(() => import("./pages/Classroom/ClassroomPeople"));
const ClassroomGrades = lazy(() => import("./pages/Classroom/ClassroomGrades"));
const AssignmentList = lazy(() => import("./pages/Assignment/AssignmentList"));
const AssignmentDetail = lazy(
  () => import("./pages/Assignment/AssignmentDetail"),
);
const SubmissionPage = lazy(() => import("./pages/Assignment/SubmissionPage"));
const GradingPage = lazy(() => import("./pages/Assignment/GradingPage"));
const GradebookView = lazy(() => import("./pages/Gradebook/GradebookView"));
const GradebookSettings = lazy(
  () => import("./pages/Gradebook/GradebookSettings"),
);
const StudentProgress = lazy(() => import("./pages/Gradebook/StudentProgress"));
const ProfileSettings = lazy(() => import("./pages/Settings/ProfileSettings"));
const AccountSettings = lazy(() => import("./pages/Settings/AccountSettings"));
const NotificationSettings = lazy(
  () => import("./pages/Settings/NotificationSettings"),
);
const ClassSettings = lazy(() => import("./pages/Settings/ClassSettings"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const ClassManagement = lazy(() => import("./pages/Admin/ClassManagement"));
const Analytics = lazy(() => import("./pages/Admin/Analytics"));
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
                      <Route path="/classroom/:id">
                        <Route path="stream" element={<ClassroomStream />} />
                        <Route path="work" element={<ClassroomWork />} />
                        <Route path="people" element={<ClassroomPeople />} />
                        <Route path="grades" element={<ClassroomGrades />} />
                        <Route index element={<Navigate to="stream" />} />
                      </Route>
                      <Route path="/assignments" element={<AssignmentList />} />
                      <Route
                        path="/assignments/:id"
                        element={<AssignmentDetail />}
                      />
                      <Route
                        path="/assignments/:id/submit"
                        element={<SubmissionPage />}
                      />
                      <Route
                        path="/assignments/:id/grade"
                        element={<GradingPage />}
                      />
                      <Route path="/gradebook" element={<GradebookView />} />
                      <Route
                        path="/gradebook/settings"
                        element={<GradebookSettings />}
                      />
                      <Route
                        path="/gradebook/student/:id"
                        element={<StudentProgress />}
                      />
                      <Route path="/settings">
                        <Route path="profile" element={<ProfileSettings />} />
                        <Route path="account" element={<AccountSettings />} />
                        <Route
                          path="notifications"
                          element={<NotificationSettings />}
                        />
                        <Route path="class/:id" element={<ClassSettings />} />
                        <Route index element={<Navigate to="profile" />} />
                      </Route>
                      <Route path="/admin">
                        <Route path="users" element={<UserManagement />} />
                        <Route path="classes" element={<ClassManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route index element={<Navigate to="users" />} />
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
