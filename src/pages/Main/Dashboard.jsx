import React, { useState, useEffect, useMemo } from "react";
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
  Autocomplete,
  useMediaQuery,
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
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  doc,
  writeBatch,
  arrayUnion,
  getDoc,
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
  const isMobile = useMediaQuery("(max-width:600px)");

  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
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
    selectedStudents: [], // stores full student objects
  });

  // Real-time Class Sync
  useEffect(() => {
    const safeQuery = query(
      collection(db, "classes"),
      orderBy("createdAt", "desc")
    );

    const unsubClasses = onSnapshot(
      safeQuery,
      (snapshot) => {
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
      },
      (error) => {
        console.error("Error fetching classes:", error);
        setLoadingClasses(false);
      }
    );

    return () => unsubClasses();
  }, []);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [campusSnap, courseSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, "campuses")),
          getDocs(collection(db, "courses")),
          getDocs(query(collection(db, "users"), where("roleName", "==", "student"))),
        ]);

        setCampuses(
          campusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setCourses(
          courseSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setStudentsList(
          studentSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || doc.data().displayName || "Unnamed Student",
            email: doc.data().email,
          }))
        );
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleCreateClass = async () => {
    const { title, campus, course, timing, selectedStudents } = formData;

    if (!title || !campus || !course || !timing) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const courseCode =
        (title.substring(0, 3).toUpperCase() || "CLS") +
        Math.floor(100 + Math.random() * 899);

      const colors = [
        "#2563eb",
        "#10b981",
        "#7c3aed",
        "#f59e0b",
        "#ec4899",
        "#06b6d4",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Store full student objects
      const studentObjects = selectedStudents.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
      }));

      const batch = writeBatch(db);
      const classRef = doc(collection(db, "classes"));
      batch.set(classRef, {
        title,
        campus,
        course,
        timing,
        students: studentObjects,          // array of objects
        studentCount: studentObjects.length,
        instructorName: mockUser.name,
        teacherId: mockUser.id,
        courseCode,
        color: randomColor,
        status: "active",
        createdAt: serverTimestamp(),
      });

      // Update each student's enrolledClasses
      studentObjects.forEach((student) => {
        const userRef = doc(db, "users", student.id);
        batch.update(userRef, {
          enrolledClasses: arrayUnion(classRef.id),
        });
      });

      await batch.commit();

      setOpen(false);
      setFormData({
        title: "",
        campus: "",
        course: "",
        timing: "",
        selectedStudents: [],
      });
    } catch (e) {
      console.error("Error creating class:", e);
      alert("Failed to create class. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!joinCode) return;
    setLoading(true);
    setJoinError("");

    try {
      const classesRef = collection(db, "classes");
      const q = query(classesRef, where("courseCode", "==", joinCode.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setJoinError("No class found with that code.");
        setLoading(false);
        return;
      }

      const classDoc = querySnapshot.docs[0];
      const classId = classDoc.id;
      const classData = classDoc.data();

      // Check if already enrolled (by id)
      if (classData.students?.some((s) => s.id === mockUser.id)) {
        setJoinError("You are already enrolled in this class.");
        setLoading(false);
        return;
      }

      // Fetch current user's details
      const userSnap = await getDoc(doc(db, "users", mockUser.id));
      const userData = userSnap.data();

      const studentObject = {
        id: mockUser.id,
        name: userData.name || mockUser.name,
        email: userData.email,
      };

      const batch = writeBatch(db);
      const classRef = doc(db, "classes", classId);
      const userRef = doc(db, "users", mockUser.id);
      batch.update(classRef, {
        students: arrayUnion(studentObject),
        studentCount: (classData.studentCount || 0) + 1,
      });
      batch.update(userRef, { enrolledClasses: arrayUnion(classId) });
      await batch.commit();

      setOpenJoin(false);
      setJoinCode("");
      alert(`Successfully joined ${classData.title || "the class"}!`);
    } catch (error) {
      console.error("Error joining class:", error);
      setJoinError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      if (filter === "all") return true;
      return c.status?.toLowerCase() === filter.toLowerCase();
    });
  }, [classes, filter]);

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

  const canCreateClass = mockUser.role === "teacher";

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
            mb: 6,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 800,
                color: darkMode ? "#f1f5f9" : "#1e293b",
                letterSpacing: -1,
                mb: 1,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Hello, {mockUser.name.split(" ")[0]} 👋
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}
            >
              Master your schedule and lead your students to success.
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}
          >
            {canCreateClass && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                fullWidth={isMobile}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
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
              fullWidth={isMobile}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                color: darkMode ? "#e2e8f0" : "#64748b",
                borderColor: darkMode ? "#475569" : "#cbd5e1",
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
            <StatsCard {...stat} darkMode={darkMode} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8.5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "24px",
              bgcolor: darkMode ? "#1e293b" : "white",
              border: "1px solid",
              borderColor: darkMode ? "#334155" : "#e2e8f0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: darkMode ? "rgba(59, 130, 246, 0.2)" : "#eff6ff",
                    color: "#3b82f6",
                  }}
                >
                  <SchoolIcon />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Academic Overview
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#94a3b8" : "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {filteredClasses.length} Courses Displayed
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: { xs: "100%", md: "auto" },
                  justifyContent: "flex-end",
                }}
              >
                <TextField
                  select
                  size="small"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <FilterListIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                    ),
                  }}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </TextField>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, val) => val && setViewMode(val)}
                  size="small"
                  aria-label="view mode"
                >
                  <ToggleButton value="grid" aria-label="grid view">
                    <GridViewIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {loadingClasses ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
                <CircularProgress />
              </Box>
            ) : filteredClasses.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  color: "text.secondary",
                }}
              >
                <SchoolIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                <Typography>No classes found matching your filter.</Typography>
              </Box>
            ) : viewMode === "grid" ? (
              <ClassGrid classes={filteredClasses} darkMode={darkMode} />
            ) : (
              <ClassTable classes={filteredClasses} darkMode={darkMode} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: { lg: "sticky" },
              top: 24,
            }}
          >
            <UpcomingAssignments darkMode={darkMode} />
            <ProgressChart
              data={classes.map((c) => ({
                name: c.name,
                value: c.students,
              }))}
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
            p: 1,
            bgcolor: darkMode ? "#1e293b" : "white",
            color: darkMode ? "white" : "black",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", pb: 1 }}>
          🚀 Launch New Class
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Class Title"
              placeholder="e.g. Advanced Mathematics"
              margin="normal"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
                  {campuses.length === 0 && (
                    <MenuItem disabled>No Campuses Loaded</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  label="Course Type"
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
                  {courses.length === 0 && (
                    <MenuItem disabled>No Courses Loaded</MenuItem>
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="students-autocomplete"
                  options={studentsList}
                  getOptionLabel={(option) => option.name}
                  value={formData.selectedStudents}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      selectedStudents: newValue,
                    });
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Students"
                      placeholder="Search students..."
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Class"
            )}
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
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: "center" }}>
          🔑 Join Environment
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            Enter the unique 6-digit code provided by your instructor.
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. MTH-101"
            autoFocus
            variant="outlined"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "1.2rem",
                letterSpacing: "2px",
              },
            }}
            error={!!joinError}
            helperText={joinError}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button onClick={() => setOpenJoin(false)} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={!joinCode || loading}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            {loading ? <CircularProgress size={20} /> : "Join Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;