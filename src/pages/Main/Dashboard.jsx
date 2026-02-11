import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Paper,
  Divider,
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
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#1a237e",
                letterSpacing: -1,
                mb: 1,
              }}
            >
              Hello, {mockUser.name.split(" ")[0]} 👋
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: 400 }}
            >
              Master your schedule and lead your students to success.
            </Typography>
          </Box>
          <Box className="flex gap-4 mt-6 md:mt-0">
            {mockUser.role === "teacher" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 10px 20px rgba(63, 81, 181, 0.2)",
                }}
              >
                Create Class
              </Button>
            )}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                border: "2px solid",
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <SchoolIcon color="primary" /> Academic Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your active learning environments
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: { xs: 2, md: 0 },
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, val) => val && setViewMode(val)}
                    size="small"
                    sx={{ bgcolor: "white" }}
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

              <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {["all", "active", "archived", "favorites"].map((f) => (
                  <Chip
                    key={f}
                    label={f.toUpperCase()}
                    onClick={() => setFilter(f)}
                    variant={filter === f ? "filled" : "outlined"}
                    color={filter === f ? "primary" : "default"}
                    sx={{ fontWeight: 600, borderRadius: "8px" }}
                  />
                ))}
              </Box>

              {viewMode === "grid" ? (
                <ClassGrid classes={mockClasses} />
              ) : (
                <ClassTable classes={mockClasses} />
              )}
            </Paper>
          </motion.div>
        </Grid>

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
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle
          sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#1a237e" }}
        >
          🚀 Launch New Class
          <Typography variant="body2" color="text.secondary">
            Fill in the details to establish your new learning portal.
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Title"
                placeholder="e.g. Advanced Web Development"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>
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
                {campuses.length > 0 ? (
                  campuses.map((c) => (
                    <MenuItem key={c.id} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No campuses found</MenuItem>
                )}
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
                {courses.length > 0 ? (
                  courses.map((c) => (
                    <MenuItem key={c.id} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No courses found</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned Instructor"
                value={formData.instructorName}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={
              loading || !formData.title || !formData.campus || !formData.course
            }
            sx={{ px: 4, borderRadius: "10px", fontWeight: 700 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Deploy Class"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
