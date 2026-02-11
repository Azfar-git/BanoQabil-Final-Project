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
} from "@mui/material"; // Fixed: Removed Divider from line 17
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  NotificationsActive as NotificationsIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

import { motion } from "framer-motion";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
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
import {
  mockClasses,
  mockAssignments,
  mockUser,
  mockAnalytics,
} from "../../data/mockData";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    campus: "",
    course: "",
    instructorName: mockUser.name,
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const campusSnap = await getDocs(collection(db, "campuses"));
        const courseSnap = await getDocs(collection(db, "courses"));

        setCampuses(
          campusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
        setCourses(
          courseSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      } catch (error) {
        console.error("Error fetching form data:", error);
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
        status: "active",
      });
      setOpen(false);
      setFormData({
        title: "",
        campus: "",
        course: "",
        instructorName: mockUser.name,
      });
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Active Classes",
      value: mockClasses.length,
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
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
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
                  boxShadow: "0 4px 14px 0 rgba(37,99,235,0.3)",
                  bgcolor: "#2563eb",
                }}
              >
                Create Class
              </Button>
            )}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.2,
                textTransform: "none",
                borderColor: "#e2e8f0",
                color: "#64748b",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f1f5f9" },
              }}
            >
              Join Class
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Main Content Area (Classes) */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Academic Overview Container - Clean White Style */}
            <Paper
              elevation={0}
              sx={{
                p: 0,
                borderRadius: "24px",
                bgcolor: "transparent",
              }}
            >
              <Box className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm mb-6">
                {/* Header Row */}
                <Box className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <Box className="flex items-center gap-3">
                    <Box className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <SchoolIcon />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          fontFamily: "Montserrat",
                          color: "#1e293b",
                          lineHeight: 1.2,
                        }}
                      >
                        Academic Overview
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#94a3b8", fontWeight: 600 }}
                      >
                        {mockClasses.length} Active Courses
                      </Typography>
                    </Box>
                  </Box>

                  {/* Controls */}
                  <Box className="flex items-center gap-4 mt-4 md:mt-0">
                    {/* Filters */}
                    <Box className="flex bg-slate-100 p-1 rounded-lg">
                      {["all", "active"].map((f) => (
                        <Box
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase cursor-pointer transition-all ${
                            filter === f
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {f}
                        </Box>
                      ))}
                    </Box>

                    {/* View Toggle */}
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(e, val) => val && setViewMode(val)}
                      size="small"
                      sx={{
                        bgcolor: "transparent",
                        "& .MuiToggleButton-root": {
                          border: "none",
                          borderRadius: "8px !important",
                          color: "#94a3b8",
                        },
                        "& .Mui-selected": {
                          bgcolor: "#f1f5f9 !important",
                          color: "#2563eb !important",
                        },
                      }}
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

                {/* Content Render */}
                {viewMode === "grid" ? (
                  <ClassGrid classes={mockClasses} />
                ) : (
                  <ClassTable classes={mockClasses} />
                )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Sidebar Widgets */}
        <Grid item xs={12} lg={4}>
          <Box className="space-y-6">
            <UpcomingAssignments />
            <CalendarWidget />
            <QuickActions />
            <ProgressChart data={mockAnalytics} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <RecentActivity />
      </Box>

      {/* CREATE CLASS MODAL */}
      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "24px", p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "Montserrat" }}>
          🚀 Launch New Class
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Class Title"
              margin="normal"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              InputProps={{ sx: { borderRadius: "12px" } }}
            />
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Campus"
                  margin="dense"
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
                  margin="dense"
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpen(false)}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: "10px", px: 4, bgcolor: "#2563eb" }}
          >
            {loading ? <CircularProgress size={24} /> : "Create Class"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
