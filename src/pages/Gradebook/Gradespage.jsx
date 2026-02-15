import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Gradebook() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        // 1. Get all classes
        const classesSnapshot = await getDocs(collection(db, "classes"));
        const allClasses = classesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. Filter classes where user is teacher or student
        const userClasses = allClasses.filter(
          (cls) =>
            String(cls.teacherId) === String(user.id) ||
            cls.students?.some((s) => String(s.id) === String(user.id))
        );

        const allAssignments = [];

        // 3. For each class, get all posts
        for (const cls of userClasses) {
          const postsSnapshot = await getDocs(
            collection(db, "classes", cls.id, "posts")
          );

          postsSnapshot.forEach((postDoc) => {
            const post = postDoc.data();

            if (user.role === "student") {
              // Student: find their own submission
              const mySubmission = post.submissions?.find(
                (s) => String(s.studentId) === String(user.id)
              );
              if (mySubmission) {
                allAssignments.push({
                  id: `${cls.id}_${postDoc.id}`,
                  classId: cls.id,
                  className: cls.title || "Untitled Class",
                  title:
                    post.content?.substring(0, 50) +
                    (post.content?.length > 50 ? "..." : ""),
                  dueDate: post.dueDate,
                  submittedAt: mySubmission.submittedAt,
                  grade: mySubmission.grade,
                  late:
                    post.dueDate && mySubmission.submittedAt
                      ? new Date(mySubmission.submittedAt) > new Date(post.dueDate)
                      : false,
                });
              }
            } else if (user.role === "teacher") {
              // Teacher: show all submissions with grades
              post.submissions?.forEach((sub, idx) => {
                if (sub.grade) {
                  allAssignments.push({
                    id: `${cls.id}_${postDoc.id}_${idx}`,
                    classId: cls.id,
                    className: cls.title || "Untitled Class",
                    title:
                      post.content?.substring(0, 50) +
                      (post.content?.length > 50 ? "..." : ""),
                    studentName: sub.studentName,
                    dueDate: post.dueDate,
                    submittedAt: sub.submittedAt,
                    grade: sub.grade,
                    late:
                      post.dueDate && sub.submittedAt
                        ? new Date(sub.submittedAt) > new Date(post.dueDate)
                        : false,
                  });
                }
              });
            }
          });
        }

        setAssignments(allAssignments);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

  const themeStyles = {
    bg: darkMode ? "!bg-gray-900" : "!bg-[#f8fafc]",
    paper: darkMode ? "!bg-gray-800 !border-gray-700" : "!bg-white",
    text: darkMode ? "!text-gray-100" : "!text-[#1e293b]",
    muted: darkMode ? "!text-gray-400" : "!text-[#64748b]",
    header: darkMode ? "!bg-gray-700" : "!bg-[#f1f5f9]",
  };

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className={`min-h-screen p-6 ${themeStyles.bg}`}>
        <Box className="max-w-6xl mx-auto">
          <Typography
            variant="h4"
            className={`font-extrabold tracking-tight mb-6 ${themeStyles.text}`}
          >
            My Grades
          </Typography>

          <TableContainer
            component={Paper}
            className={`rounded-2xl shadow-sm ${themeStyles.paper}`}
          >
            <Table>
              <TableHead className={themeStyles.header}>
                <TableRow>
                  <TableCell className="font-bold">Class</TableCell>
                  <TableCell className="font-bold">Assignment</TableCell>
                  {user?.role === "teacher" && (
                    <TableCell className="font-bold">Student</TableCell>
                  )}
                  <TableCell className="font-bold">Due Date</TableCell>
                  <TableCell className="font-bold">Submitted</TableCell>
                  <TableCell className="font-bold">Grade</TableCell>
                  <TableCell className="font-bold">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={user?.role === "teacher" ? 7 : 6}
                      align="center"
                      className="py-8"
                    >
                      <Typography className={themeStyles.muted}>
                        No grades found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <TableRow
                      key={assignment.id}
                      hover
                    >
                      <TableCell className={themeStyles.text}>
                        {assignment.className}
                      </TableCell>
                      <TableCell className={themeStyles.text}>
                        {assignment.title}
                      </TableCell>
                      {user?.role === "teacher" && (
                        <TableCell className={themeStyles.muted}>
                          {assignment.studentName}
                        </TableCell>
                      )}
                      <TableCell className={themeStyles.muted}>
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className={themeStyles.muted}>
                        {assignment.submittedAt
                          ? new Date(assignment.submittedAt).toLocaleDateString()
                          : "Not submitted"}
                      </TableCell>
                      <TableCell>
                        {assignment.grade ? (
                          <Chip
                            label={assignment.grade}
                            color="success"
                            size="small"
                            className="font-bold"
                          />
                        ) : (
                          <span className={themeStyles.muted}>—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignment.submittedAt ? (
                          assignment.late ? (
                            <Chip label="Late" color="warning" size="small" />
                          ) : (
                            <Chip label="On Time" color="success" size="small" />
                          )
                        ) : assignment.dueDate &&
                          new Date(assignment.dueDate) < new Date() ? (
                          <Chip label="Missing" color="error" size="small" />
                        ) : (
                          <Chip label="Pending" color="default" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </motion.div>
  );
}