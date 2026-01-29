import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const GradeTable = ({ classId, students = [] }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [grades, setGrades] = useState(
    students.length > 0
      ? students.map((s) => ({
          studentId: s.id,
          studentName: s.name,
          assignment1: Math.random() * 100,
          assignment2: Math.random() * 100,
          midterm: Math.random() * 100,
          finalExam: Math.random() * 100,
        }))
      : [
          { studentId: 1, studentName: 'John Doe', assignment1: 85, assignment2: 90, midterm: 88, finalExam: 92 },
          { studentId: 2, studentName: 'Jane Smith', assignment1: 92, assignment2: 88, midterm: 95, finalExam: 89 },
          { studentId: 3, studentName: 'Bob Johnson', assignment1: 78, assignment2: 82, midterm: 80, finalExam: 85 },
        ]
  );

  const handleGradeChange = (studentId, assignment, value) => {
    setGrades(
      grades.map((g) =>
        g.studentId === studentId ? { ...g, [assignment]: parseFloat(value) || 0 } : g
      )
    );
  };

  const calculateAverage = (student) => {
    const values = [student.assignment1, student.assignment2, student.midterm, student.finalExam];
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
        <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
          Grade Book
        </Typography>

        <Table>
          <TableHead>
            <TableRow className="bg-gray-100 dark:bg-gray-700">
              <TableCell className="font-semibold">Student</TableCell>
              <TableCell align="center" className="font-semibold">Assignment 1</TableCell>
              <TableCell align="center" className="font-semibold">Assignment 2</TableCell>
              <TableCell align="center" className="font-semibold">Midterm</TableCell>
              <TableCell align="center" className="font-semibold">Final Exam</TableCell>
              <TableCell align="center" className="font-semibold">Average</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((student, index) => (
              <motion.tr
                key={student.studentId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                component="tr"
              >
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {student.studentName}
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={student.assignment1.toFixed(2)}
                    onChange={(e) => handleGradeChange(student.studentId, 'assignment1', e.target.value)}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={student.assignment2.toFixed(2)}
                    onChange={(e) => handleGradeChange(student.studentId, 'assignment2', e.target.value)}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={student.midterm.toFixed(2)}
                    onChange={(e) => handleGradeChange(student.studentId, 'midterm', e.target.value)}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={student.finalExam.toFixed(2)}
                    onChange={(e) => handleGradeChange(student.studentId, 'finalExam', e.target.value)}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </TableCell>
                <TableCell align="center" className="font-bold">
                  <Box
                    className={`px-3 py-1 rounded ${
                      calculateAverage(student) >= 90
                        ? 'bg-green-100 text-green-800'
                        : calculateAverage(student) >= 80
                        ? 'bg-blue-100 text-blue-800'
                        : calculateAverage(student) >= 70
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {calculateAverage(student)}
                  </Box>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        <Box className="mt-6 flex gap-2">
          <Button variant="outlined">Download as CSV</Button>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default GradeTable;
