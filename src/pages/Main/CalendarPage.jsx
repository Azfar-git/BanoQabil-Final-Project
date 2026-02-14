import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // Dark mode observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch assignments from all classes the user is in
  useEffect(() => {
    if (!user?.id) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    const fetchClassesAndPosts = async () => {
      setLoading(true);
      try {
        // 1. Get all classes where user is teacher OR student
        const classesRef = collection(db, "classes");
        const classesSnapshot = await getDocs(classesRef);
        const userClasses = [];

        classesSnapshot.forEach((doc) => {
          const data = doc.data();
          // Check if user is teacher
          if (data.teacherId === user.id) {
            userClasses.push({ id: doc.id, ...data });
          }
          // Check if user is student (in students array)
          if (data.students?.some((s) => s.id === user.id)) {
            userClasses.push({ id: doc.id, ...data });
          }
        });

        // Remove duplicates (in case user is both teacher and student)
        const uniqueClasses = Array.from(
          new Map(userClasses.map((c) => [c.id, c])).values(),
        );

        // 2. For each class, listen to posts with dueDate
        const unsubscribes = [];
        const allPosts = [];

        uniqueClasses.forEach((classData) => {
          const postsRef = collection(db, "classes", classData.id, "posts");
          const q = query(
            postsRef,
            where("dueDate", "!=", null),
            orderBy("dueDate", "asc"),
          );

          const unsub = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
                const post = {
                  id: change.doc.id,
                  ...change.doc.data(),
                  class: classData.title,
                };
                // Remove old version if exists
                const index = allPosts.findIndex(
                  (p) => p.id === post.id && p.classId === classData.id,
                );
                if (index !== -1) allPosts.splice(index, 1);
                allPosts.push(post);
              } else if (change.type === "removed") {
                const index = allPosts.findIndex(
                  (p) => p.id === change.doc.id && p.classId === classData.id,
                );
                if (index !== -1) allPosts.splice(index, 1);
              }
            });
            // Update state with a copy
            setAssignments([...allPosts]);
          });

          unsubscribes.push(unsub);
        });

        setLoading(false);

        // Cleanup listeners on unmount
        return () => {
          unsubscribes.forEach((unsub) => unsub());
        };
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setLoading(false);
      }
    };

    fetchClassesAndPosts();
  }, [user]);

  // Helper to check if user has submitted to a post and if it's late
  const getUserSubmissionStatus = (post) => {
    if (!post.submissions) return { submitted: false, late: false };
    const mySubmission = post.submissions.find((s) => s.studentId === user?.id);
    if (!mySubmission) return { submitted: false, late: false };
    const submittedAt = new Date(mySubmission.submittedAt);
    const dueDate = post.dueDate ? new Date(post.dueDate) : null;
    const late = dueDate ? submittedAt > dueDate : false;
    return { submitted: true, late };
  };

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  const firstDay = firstDayOfMonth(currentDate);
  const numDays = daysInMonth(currentDate);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= numDays; i++) days.push(i);

  const hasEvent = (day) => {
    if (!day) return false;
    return assignments.some((a) => {
      const d = new Date(a.dueDate);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const theme = {
    pageBg: isDark ? "!bg-gray-900" : "!bg-[#f8fafc]",
    card: isDark
      ? "!bg-gray-800 !border-gray-700"
      : "!bg-white !border-slate-200",
    textMain: isDark ? "!text-gray-100" : "!text-[#1e293b]",
    textMuted: isDark ? "!text-gray-400" : "!text-[#64748b]",
    headerBg: isDark
      ? "!bg-gray-900 !border-gray-700"
      : "!bg-[#f8fafc] !border-slate-200",
    itemHover: isDark ? "hover:!bg-gray-700" : "hover:!bg-slate-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        className={`min-h-screen p-6 transition-all duration-300 ${theme.pageBg}`}
      >
        <Box className="max-w-6xl mx-auto">
          {/* Header */}
          <Box className="flex items-center justify-between mb-8">
            <Box>
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon size={20} className="text-[#2563eb]" />
                <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-[0.2em]">
                  Academic Planner
                </span>
              </div>
              <Typography
                variant="h4"
                className={`font-extrabold tracking-tight ${theme.textMain}`}
              >
                Calendar
              </Typography>
            </Box>
            <Box className="text-right">
              <Typography className={`${theme.textMuted} font-semibold`}>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Main Calendar */}
            <Grid item xs={12} md={8}>
              <Card
                className={`rounded-2xl border shadow-sm !overflow-hidden ${theme.card}`}
              >
                <CardContent className="p-6">
                  <Box className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <Typography
                          key={day}
                          className={`text-center text-[11px] font-bold uppercase tracking-widest py-4 ${theme.textMuted}`}
                        >
                          {day}
                        </Typography>
                      ),
                    )}

                    {days.map((day, i) => {
                      const isToday = day === currentDate.getDate();
                      const dayHasEvent = hasEvent(day);
                      return (
                        <Box
                          key={i}
                          className={`relative h-20 p-2 rounded-xl transition-all border ${
                            day === null
                              ? "border-transparent"
                              : isToday
                                ? isDark
                                  ? "!bg-blue-900/40 !border-blue-600 !text-blue-400"
                                  : "!bg-[#eff6ff] !border-[#3b82f6] !text-[#2563eb]"
                                : `${theme.card} ${theme.itemHover} hover:!border-blue-400`
                          } ${day === null ? "" : "cursor-pointer"}`}
                        >
                          <Typography
                            className={`text-sm font-bold ${
                              isToday ? "!text-blue-400" : theme.textMain
                            }`}
                          >
                            {day}
                          </Typography>
                          {dayHasEvent && (
                            <div className="absolute bottom-2 right-2">
                              <BookOpen
                                size={14}
                                className={
                                  isToday || isDark
                                    ? "text-blue-400"
                                    : "text-[#3b82f6]"
                                }
                              />
                            </div>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar: Pending Assignments */}
            <Grid item xs={12} md={4}>
              <Card
                className={`rounded-2xl border shadow-sm !overflow-hidden ${theme.card}`}
              >
                <div
                  className={`px-5 py-4 border-b flex items-center justify-between ${theme.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-[#2563eb]" />
                    <Typography
                      className={`font-bold text-sm uppercase tracking-wide ${theme.textMain}`}
                    >
                      Pending Assignments
                    </Typography>
                  </div>
                  <ChevronRight size={16} className={theme.textMuted} />
                </div>
                <CardContent className="p-4">
                  {loading ? (
                    <Box className="text-center py-8">
                      <Typography className={theme.textMuted}>
                        Loading...
                      </Typography>
                    </Box>
                  ) : assignments.length === 0 ? (
                    <Box className="text-center py-8">
                      <Typography className={theme.textMuted}>
                        No assignments with due dates
                      </Typography>
                    </Box>
                  ) : (
                    <Box className="space-y-3">
                      {assignments.map((assignment) => {
                        const { submitted, late } =
                          getUserSubmissionStatus(assignment);
                        const dueDate = new Date(assignment.dueDate);
                        const isPastDue = dueDate < new Date() && !submitted;
                        return (
                          <Box
                            key={assignment.id}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                              isDark
                                ? "!bg-gray-700/50 !border-gray-600 hover:!bg-gray-700"
                                : "!bg-white !border-slate-100 hover:shadow-md hover:!border-blue-100"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <Typography
                                className={`text-sm font-bold transition-colors group-hover:text-[#2563eb] ${theme.textMain}`}
                              >
                                {assignment.title || "Untitled Post"}
                              </Typography>
                              <div className="flex items-center gap-1 shrink-0">
                                {submitted ? (
                                  late ? (
                                    <AlertCircle
                                      size={14}
                                      className="text-orange-500"
                                    />
                                  ) : (
                                    <CheckCircle
                                      size={14}
                                      className="text-green-500"
                                    />
                                  )
                                ) : (
                                  <Clock
                                    size={14}
                                    className="text-yellow-500"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isDark ? "bg-blue-500" : "bg-[#3b82f6]"
                                }`}
                              />
                              <Typography
                                variant="caption"
                                className={`font-medium ${theme.textMuted}`}
                              >
                                {assignment.class} • Due{" "}
                                {dueDate.toLocaleDateString()}
                              </Typography>
                            </div>
                            <Typography
                              variant="caption"
                              className={`block mt-1 ${
                                submitted
                                  ? late
                                    ? "text-orange-500"
                                    : "text-green-500"
                                  : isPastDue
                                    ? "text-red-500"
                                    : theme.textMuted
                              }`}
                            >
                              {submitted
                                ? late
                                  ? "Submitted (Late)"
                                  : "Submitted"
                                : isPastDue
                                  ? "Missing"
                                  : "Not submitted"}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
