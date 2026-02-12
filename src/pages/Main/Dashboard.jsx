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
} from "firebase/firestore";

import ClassGrid from "../../components/Dashboard/ClassGrid";
import ClassTable from "../../components/Dashboard/ClassTable";
import UpcomingAssignments from "../../components/Dashboard/UpcomingAssignments";
import StatsCard from "../../components/Dashboard/StatsCard";
import ProgressChart from "../../components/Widgets/ProgressChart";
import { mockAssignments, mockUser } from "../../data/mockData";
import { useTheme } from "../../context/ThemeContext";

const Dashboard = () => {
  const { darkMode } = useTheme();

  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [joinCode, setJoinCode] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    campus: "",
    course: "",
    instructorName: mockUser.name,
  });

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

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [campusSnap, courseSnap] = await Promise.all([
          getDocs(collection(db, "campuses")),
          getDocs(collection(db, "courses")),
        ]);
        setCampuses(
          campusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
        setCourses(
          courseSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleCreateClass = async () => {
    if (!formData.title || !formData.campus || !formData.course) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "classes"), {
        ...formData,
        createdAt: serverTimestamp(),
        teacherId: mockUser.id,
        studentCount: 0,
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
        instructorName: mockUser.name,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = () => {
    if (!joinCode) return;
    setLoading(true);
    setTimeout(() => {
      setOpenJoin(false);
      setJoinCode("");
      setLoading(false);
    }, 800);
  };

  const filteredClasses = classes.filter((c) => {
    if (filter === "all") return true;
    return c.status?.toLowerCase() === filter.toLowerCase();
  });

  const stats = [
    {
      title: "Active Classes",
      value: classes.filter((c) => c.status === "active").length,
      change: "+2 this month",
      icon: <TrendingUpIcon />,
      color: "primary",
    },
    {
      title: "Pending Assignments",
      value: mockAssignments.filter((a) => a.status === "pending").length,
      change: "3 due this week",
      icon: <AssignmentIcon />,
      color: "warning",
    },
    {
      title: "Upcoming Events",
      value: 5,
      change: "Next: Tomorrow",
      icon: <EventIcon />,
      color: "success",
    },
    {
      title: "Unread Notifications",
      value: 3,
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
        bgcolor: darkMode ? "gray.900" : "#f8fafc",
        color: darkMode ? "gray.100" : "gray.900",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
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
              Hello, {mockUser.name.split(" ")[0]} 👋
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: darkMode ? "gray.400" : "#64748b" }}
            >
              Master your schedule and lead your students to success.
            </Typography>
          </Box>
          <Box className="flex gap-3 mt-4 md:mt-0">
            {mockUser.role === "teacher" && (
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
                  color: "#fff",
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
                "&:hover": {
                  borderColor: darkMode ? "gray.500" : "#9ca3af",
                  backgroundColor: darkMode ? "gray.800" : "#f3f4f6",
                },
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

      {/* Classes Grid / Table */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8.5}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: "24px",
              bgcolor: "transparent",
            }}
          >
            <Box
              className={`p-6 rounded-[24px] border mb-6 shadow-sm ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <Box className="flex flex-col md:flex-row justify-between items-center mb-6">
                <Box className="flex items-center gap-3">
                  <Box
                    className={`p-2 rounded-xl ${
                      darkMode
                        ? "bg-gray-700 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <SchoolIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        fontFamily: "Montserrat",
                        color: darkMode ? "gray.100" : "gray.900",
                      }}
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
                  <Box
                    className={`flex p-1 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-slate-100"
                    }`}
                  >
                    {["all", "active"].map((f) => (
                      <Box
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase cursor-pointer transition-all ${
                          filter === f
                            ? "bg-white text-blue-600 shadow-sm"
                            : darkMode
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {f}
                      </Box>
                    ))}
                  </Box>
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
                  <CircularProgress color={darkMode ? "inherit" : "primary"} />
                </Box>
              ) : viewMode === "grid" ? (
                <ClassGrid classes={filteredClasses} darkMode={darkMode} />
              ) : (
                <ClassTable classes={filteredClasses} darkMode={darkMode} />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3.5}>
          <Box className="space-y-6 sticky top-6">
            <UpcomingAssignments darkMode={darkMode} />
            <ProgressChart
              data={classes.map((c) => ({ name: c.name, value: c.students }))}
              darkMode={darkMode}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Modals remain same */}
      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 2,
            bgcolor: darkMode ? "gray.800" : "white",
            color: darkMode ? "gray.100" : "gray.900",
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
            InputProps={{
              sx: {
                bgcolor: darkMode ? "gray.700" : "white",
                color: darkMode ? "gray.100" : "gray.900",
              },
            }}
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Campus"
                value={formData.campus}
                onChange={(e) =>
                  setFormData({ ...formData, campus: e.target.value })
                }
                InputProps={{
                  sx: {
                    bgcolor: darkMode ? "gray.700" : "white",
                    color: darkMode ? "gray.100" : "gray.900",
                  },
                }}
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
                label="Course"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                InputProps={{
                  sx: {
                    bgcolor: darkMode ? "gray.700" : "white",
                    color: darkMode ? "gray.100" : "gray.900",
                  },
                }}
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
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

      <Dialog
        open={openJoin}
        onClose={() => !loading && setOpenJoin(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 2,
            bgcolor: darkMode ? "gray.800" : "white",
            color: darkMode ? "gray.100" : "gray.900",
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
            InputProps={{
              sx: {
                bgcolor: darkMode ? "gray.700" : "white",
                color: darkMode ? "gray.100" : "gray.900",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenJoin(false)}>Cancel</Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={!joinCode || loading}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
