import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Paper,
  Chip,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  NotificationsActive as NotificationsIcon,
  School as SchoolIcon,
  GroupAdd as GroupAddIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  updateDoc,
  doc,
  arrayUnion,
  increment,
} from "firebase/firestore";

import ClassGrid from "../../components/Dashboard/ClassGrid";
import ClassTable from "../../components/Dashboard/ClassTable";
import UpcomingAssignments from "../../components/Dashboard/UpcomingAssignments";
import StatsCard from "../../components/Dashboard/StatsCard";
import ProgressChart from "../../components/Widgets/ProgressChart";
import { useTheme } from "../../context/ThemeContext";

// NOTE: Assuming you have an AuthContext to get the current logged-in user.
// Replace this import path with your actual AuthContext path.
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { darkMode } = useTheme();

  // Fetch real user data instead of mockUser
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // State for real assignments
  const [assignments, setAssignments] = useState([]);

  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [joinCode, setJoinCode] = useState("");

  const timings = [
    "12 - 2 pm",
    "2 - 4 pm",
    "4 - 6 pm",
    "6 - 8 pm",
    "8 - 10 pm",
  ];

  const [formData, setFormData] = useState({
    title: "",
    campus: "",
    course: "",
    timing: "",
    selectedStudents: [],
    instructorName: user?.name || user?.displayName || "Unknown Instructor",
  });

  // 1. Real-time Class Sync
  useEffect(() => {
    const qClasses = query(
      collection(db, "classes"),
      orderBy("createdAt", "desc"),
    );
    const unsubClasses = onSnapshot(qClasses, (snapshot) => {
      const classData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: data.title || "Untitled Class",
          teacher: data.instructorName || "Unknown Instructor",
          code: data.courseCode || "N/A",
          students: data.studentCount || 0,
          color: data.color || "#2563eb",
          status: data.status || "active",
        };
      });
      setClasses(classData);
      setLoadingClasses(false);
    });
    return () => unsubClasses();
  }, []);

  // 2. Real-time Assignments Sync (Replacing mockAssignments)
  useEffect(() => {
    if (!user) return;
    const qAssignments = query(
      collection(db, "assignments"),
      // You can add a where() clause here to filter by user's classes if needed
      // where("classId", "in", userClassIds)
    );
    const unsubAssignments = onSnapshot(qAssignments, (snapshot) => {
      const assignmentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignments(assignmentData);
    });
    return () => unsubAssignments();
  }, [user]);

  // 3. Fetch Dropdown Data (Campuses, Courses, and Students)
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const campusSnap = await getDocs(collection(db, "campuses"));
        const courseSnap = await getDocs(collection(db, "courses"));

        const studentQuery = query(
          collection(db, "users"),
          where("roleName", "==", "student"),
        );
        const studentSnap = await getDocs(studentQuery);

        setCampuses(
          campusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
        setCourses(
          courseSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
        setStudentsList(
          studentSnap.docs.map((doc) => ({
            id: doc.id,
            name:
              doc.data().name || doc.data().displayName || "Unnamed Student",
            ...doc.data(),
          })),
        );
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleCreateClass = async () => {
    if (
      !formData.title ||
      !formData.campus ||
      !formData.course ||
      !formData.timing
    ) {
      alert(
        "Please fill in all required fields (Title, Campus, Timing, and Course)",
      );
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "classes"), {
        ...formData,
        createdAt: serverTimestamp(),
        teacherId: user?.uid, // Use real user ID
        studentCount: formData.selectedStudents.length,
        courseCode:
          formData.title.substring(0, 3).toUpperCase() +
          Math.floor(100 + Math.random() * 899),
        color: ["#2563eb", "#10b981", "#7c3aed", "#f59e0b"][
          Math.floor(Math.random() * 4)
        ],
        status: "active",
      });

      setOpen(false);
      setFormData({
        title: "",
        campus: "",
        course: "",
        timing: "",
        selectedStudents: [],
        instructorName: user?.name || user?.displayName || "Unknown Instructor",
      });
    } catch (e) {
      console.error("Error creating class:", e);
    } finally {
      setLoading(false);
    }
  };

  // 4. Actual Join Class Functionality
  const handleJoinClass = async () => {
    if (!joinCode || !user) return;
    setLoading(true);
    try {
      // Find the class with the matching code
      const q = query(
        collection(db, "classes"),
        where("courseCode", "==", joinCode.toUpperCase()),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Invalid class code. Please try again.");
        setLoading(false);
        return;
      }

      // Get the document reference for the matched class
      const classDoc = querySnapshot.docs[0];
      const classRef = doc(db, "classes", classDoc.id);

      // Add the current user to the class's selectedStudents array & increment count
      await updateDoc(classRef, {
        selectedStudents: arrayUnion(
          user.name || user.displayName || "Unknown Student",
        ),
        studentCount: increment(1),
      });

      setOpenJoin(false);
      setJoinCode("");
      alert("Successfully joined the class!");
    } catch (err) {
      console.error("Error joining class:", err);
      alert("Failed to join class. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Filter functionality applied based on the filter state
  const filteredClasses = classes.filter((c) => {
    if (filter === "all") return true;
    return c.status?.toLowerCase() === filter.toLowerCase();
  });

  const stats = [
    {
      title: "Active Classes",
      value: classes.filter((c) => c.status === "active").length,
      change: "Updated real-time",
      icon: <TrendingUpIcon />,
      color: "primary",
    },
    {
      title: "Pending Assignments",
      value: assignments.filter((a) => a.status === "pending").length,
      change: "Requires attention",
      icon: <AssignmentIcon />,
      color: "warning",
    },
    {
      title: "Upcoming Events",
      value: 5, // You can replace this with a real events fetch similar to assignments
      change: "Next: Tomorrow",
      icon: <EventIcon />,
      color: "success",
    },
    {
      title: "Unread Notifications",
      value: 3, // Can be replaced by real notifications count
      change: "2 new today",
      icon: <NotificationsIcon />,
      color: "error",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        bgcolor: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "gray.100" : "gray.900",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 10,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: darkMode ? "gray.100" : "#1e293b",
                letterSpacing: -1,
                mb: 1,
                fontFamily: "Montserrat",
              }}
            >
              {/* Uses real user name */}
              Hello, {
                (user?.name || user?.displayName || "User").split(" ")[0]
              }{" "}
              👋
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: darkMode ? "gray.400" : "#64748b" }}
            >
              Master your schedule and lead your students to success.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 4, md: 0 } }}>
            {/* Uses real user role */}
            {(user?.role === "teacher" || user?.roleName === "teacher") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                Create Class
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<GroupAddIcon />}
              onClick={() => setOpenJoin(true)}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.2,
                textTransform: "none",
                color: darkMode ? "gray.200" : "#64748b",
                borderColor: darkMode ? "gray.700" : "#d1d5db",
              }}
            >
              Join Class
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} darkMode={darkMode} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8.5}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: "24px",
              bgcolor: darkMode ? "#1e293b" : "white",
              border: "1px solid",
              borderColor: darkMode ? "gray.700" : "gray.200",
            }}
          >
            <Box className="flex flex-col md:flex-row justify-between items-center mb-6">
              <Box className="flex items-center gap-3">
                <Box
                  className={`p-2 rounded-xl ${darkMode ? "bg-gray-700 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                >
                  <SchoolIcon />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, fontFamily: "Montserrat" }}
                  >
                    Academic Overview
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "gray.400" : "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    {filteredClasses.length} Courses Displayed
                  </Typography>
                </Box>
              </Box>
              <Box className="flex items-center gap-4 mt-4 md:mt-0">
                {/* 5. Added Filter Dropdown to make use of setFilter */}
                <FormControl size="small">
                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{
                      borderRadius: "8px",
                      color: darkMode ? "white" : "inherit",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "gray.600" : "inherit",
                      },
                    }}
                  >
                    <MenuItem value="all">All Classes</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, val) => val && setViewMode(val)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <GridViewIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewListIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {loadingClasses ? (
              <Box className="flex justify-center p-10">
                <CircularProgress />
              </Box>
            ) : viewMode === "grid" ? (
              <ClassGrid classes={filteredClasses} darkMode={darkMode} />
            ) : (
              <ClassTable classes={filteredClasses} darkMode={darkMode} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3.5}>
          <Box className="space-y-6 sticky top-6">
            <UpcomingAssignments
              darkMode={darkMode}
              assignments={assignments}
            />
            <ProgressChart
              data={classes.map((c) => ({ name: c.name, value: c.students }))}
              darkMode={darkMode}
            />
          </Box>
        </Grid>
      </Grid>

      {/* CREATE CLASS MODAL */}
      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 2,
            bgcolor: darkMode ? "#1e293b" : "white",
            color: darkMode ? "white" : "black",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>🚀 Launch New Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Title"
            margin="normal"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Campus"
                value={formData.campus}
                onChange={(e) =>
                  setFormData({ ...formData, campus: e.target.value })
                }
              >
                {campuses.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Timing"
                value={formData.timing}
                onChange={(e) =>
                  setFormData({ ...formData, timing: e.target.value })
                }
              >
                {timings.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Course"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Student Multi-Select */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="student-select-label">Add Students</InputLabel>
                <Select
                  labelId="student-select-label"
                  multiple
                  value={formData.selectedStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selectedStudents: e.target.value,
                    })
                  }
                  input={<OutlinedInput label="Add Students" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {studentsList.length > 0 ? (
                    studentsList.map((student) => (
                      <MenuItem key={student.id} value={student.name}>
                        {student.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No students found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Class"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* JOIN CLASS MODAL */}
      <Dialog
        open={openJoin}
        onClose={() => !loading && setOpenJoin(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 2,
            bgcolor: darkMode ? "#1e293b" : "white",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>🔑 Join Environment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Enter Class Code"
            margin="normal"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenJoin(false)}>Cancel</Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={!joinCode || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Join"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
