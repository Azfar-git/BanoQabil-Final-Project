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
  limit,
} from "firebase/firestore";

// Components
import ClassGrid from "../../components/Dashboard/ClassGrid";
import ClassTable from "../../components/Dashboard/ClassTable";
import UpcomingAssignments from "../../components/Dashboard/UpcomingAssignments";
import CalendarWidget from "../../components/Dashboard/CalendarWidget";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import StatsCard from "../../components/Dashboard/StatsCard";
import QuickActions from "../../components/Widgets/QuickActions";
import ProgressChart from "../../components/Widgets/ProgressChart";
import { mockAssignments, mockUser } from "../../data/mockData";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");

  const [classes, setClasses] = useState([]);
  const [activities, setActivities] = useState([]);
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
      // Inside your useEffect for classes
      const classData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure these names match what the Grid/Table components expect
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

    const qActivity = query(
      collection(db, "activity"),
      orderBy("timestamp", "desc"),
      limit(5),
    );
    const unsubActivity = onSnapshot(qActivity, (snapshot) => {
      const activityData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(activityData);
    });

    return () => {
      unsubClasses();
      unsubActivity();
    };
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

      await addDoc(collection(db, "activity"), {
        type: "class_created",
        message: `Created new class: ${formData.title}`,
        timestamp: serverTimestamp(),
        user: mockUser.name,
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

  // FIXED FILTER LOGIC
  const filteredClasses = classes.filter((c) => {
    if (filter === "all") return true;
    // Ensuring case-insensitive comparison
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
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", bgcolor: "#f8fafc" }}>
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
                color: "#1e293b",
                letterSpacing: -1,
                mb: 1,
                fontFamily: "Montserrat",
              }}
            >
              Hello, {mockUser.name.split(" ")[0]} 👋
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
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
                color: "#64748b",
              }}
            >
              Join Class
            </Button>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{ p: 0, borderRadius: "24px", bgcolor: "transparent" }}
          >
            <Box className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm mb-6">
              <Box className="flex flex-col md:flex-row justify-between items-center mb-6">
                <Box className="flex items-center gap-3">
                  <Box className="p-2 bg-blue-50 text-blue-600 rounded-xl">
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
                      sx={{ color: "#94a3b8", fontWeight: 600 }}
                    >
                      {filteredClasses.length} Courses Displayed
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex items-center gap-4 mt-4 md:mt-0">
                  <Box className="flex bg-slate-100 p-1 rounded-lg">
                    {["all", "active"].map((f) => (
                      <Box
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase cursor-pointer transition-all ${filter === f ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
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
                  <CircularProgress />
                </Box>
              ) : viewMode === "grid" ? (
                <ClassGrid classes={filteredClasses} />
              ) : (
                <ClassTable classes={filteredClasses} />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box className="space-y-6">
            <UpcomingAssignments />
            <CalendarWidget />
            <QuickActions />
            <ProgressChart
              data={classes.map((c) => ({ name: c.name, value: c.students }))}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <RecentActivity activities={activities} />
      </Box>

      {/* MODALS RENDERED HERE (Omitted for brevity but identical to previous correct version) */}
      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "24px", p: 2 } }}
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
        PaperProps={{ sx: { borderRadius: "24px", p: 2 } }}
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
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
