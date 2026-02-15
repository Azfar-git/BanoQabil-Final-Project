import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { Award, BookOpen, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function GradesPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
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

  // Fetch grades
  useEffect(() => {
    if (!user?.id) return;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const classesRef = collection(db, "classes");
        const classesSnapshot = await getDocs(classesRef);
        const userClasses = [];

        classesSnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert IDs to strings for safe comparison
          const teacherIdStr = String(data.teacherId || "");
          const userIdStr = String(user.id);

          if (teacherIdStr === userIdStr) {
            userClasses.push({ id: doc.id, ...data });
          }
          if (data.students?.some((s) => String(s.id) === userIdStr)) {
            userClasses.push({ id: doc.id, ...data });
          }
        });

        // Remove duplicate classes (in case user is both teacher and student)
        const uniqueClasses = Array.from(
          new Map(userClasses.map((c) => [c.id, c])).values()
        );

        const allGrades = [];

        for (const cls of uniqueClasses) {
          const postsRef = collection(db, "classes", cls.id, "posts");
          const postsSnapshot = await getDocs(postsRef);

          postsSnapshot.forEach((postDoc) => {
            const post = postDoc.data();
            if (!post.submissions) return;

            if (user.role === "student") {
              // Student: find their own submission with a grade
              const mySubmission = post.submissions.find(
                (s) => String(s.studentId) === String(user.id)
              );
              if (mySubmission && mySubmission.grade) {
                allGrades.push({
                  id: `${cls.id}_${postDoc.id}`,
                  className: cls.title || "Untitled Class",
                  assignmentTitle:
                    post.content?.substring(0, 50) +
                    (post.content?.length > 50 ? "..." : ""),
                  grade: mySubmission.grade,
                  submittedAt: mySubmission.submittedAt,
                  dueDate: post.dueDate,
                });
              }
            } else if (user.role === "teacher") {
              // Teacher: show all submissions with grades
              post.submissions.forEach((sub, index) => {
                if (sub.grade) {
                  allGrades.push({
                    id: `${cls.id}_${postDoc.id}_${index}`,
                    className: cls.title || "Untitled Class",
                    assignmentTitle:
                      post.content?.substring(0, 50) +
                      (post.content?.length > 50 ? "..." : ""),
                    studentName: sub.studentName,
                    grade: sub.grade,
                    submittedAt: sub.submittedAt,
                    dueDate: post.dueDate,
                  });
                }
              });
            }
          });
        }

        setGrades(allGrades);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

  const theme = {
    pageBg: isDark ? "!bg-gray-900" : "!bg-[#f8fafc]",
    card: isDark
      ? "!bg-gray-800 !border-gray-700"
      : "!bg-white !border-slate-200",
    textMain: isDark ? "!text-gray-100" : "!text-[#1e293b]",
    textMuted: isDark ? "!text-gray-400" : "!text-[#64748b]",
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
        <Box className="max-w-5xl mx-auto">
          <Box className="flex items-center gap-3 mb-8">
            <Award size={28} className="text-[#2563eb]" />
            <Typography
              variant="h4"
              className={`font-extrabold tracking-tight ${theme.textMain}`}
            >
              My Grades
            </Typography>
          </Box>

          {loading ? (
            <Box className="text-center py-20">
              <Typography className={theme.textMuted}>
                Loading grades...
              </Typography>
            </Box>
          ) : grades.length === 0 ? (
            <Box className="text-center py-20">
              <BookOpen
                size={48}
                className={`mx-auto mb-4 ${theme.textMuted}`}
              />
              <Typography className={theme.textMain}>
                No grades available yet.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {grades.map((grade) => (
                <Grid item xs={12} key={grade.id}>
                  <Card
                    className={`rounded-2xl border shadow-sm !overflow-hidden ${theme.card}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <Typography
                            className={`text-sm font-black uppercase tracking-wider ${theme.textMuted}`}
                          >
                            {grade.className}
                          </Typography>
                          <Typography
                            className={`text-lg font-bold mt-1 ${theme.textMain}`}
                          >
                            {grade.assignmentTitle}
                          </Typography>
                          {grade.studentName && (
                            <Typography
                              className={`text-xs mt-1 ${theme.textMuted}`}
                            >
                              Student: {grade.studentName}
                            </Typography>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            {grade.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className={theme.textMuted} />
                                <Typography
                                  variant="caption"
                                  className={theme.textMuted}
                                >
                                  Due:{" "}
                                  {new Date(grade.dueDate).toLocaleDateString()}
                                </Typography>
                              </div>
                            )}
                            {grade.submittedAt && (
                              <div className="flex items-center gap-1">
                                <ChevronRight
                                  size={14}
                                  className={theme.textMuted}
                                />
                                <Typography
                                  variant="caption"
                                  className={theme.textMuted}
                                >
                                  Submitted:{" "}
                                  {new Date(grade.submittedAt).toLocaleDateString()}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Chip
                            label={grade.grade}
                            className="!bg-emerald-500/10 !text-emerald-600 !font-black !text-lg !px-4 !py-2 !h-auto !rounded-xl"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}