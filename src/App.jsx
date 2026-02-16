import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Campuses from "./pages/Campuses";
import Supervisor from "./pages/Supervisor";
import Dashboard from "./pages/Dashboard";
import AdminAccess from "./pages/AdminAccess";
import RolesState from "./context/rolesContext/RolesState";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="campuses" element={<Campuses />} />
            <Route path="supervisor" element={<Supervisor />} />
            <Route path="AdminAccess" element={<AdminAccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
