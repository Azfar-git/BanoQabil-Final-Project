import React from 'react';
import { Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { motion } from 'framer-motion';

export default function GradebookView() {
  const students = [
    { id: 1, name: 'Muhammad Ali', email: 'ali@example.com', assignment1: 95, assignment2: 88, midterm: 92, final: null },
    { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', assignment1: 92, assignment2: 95, midterm: 89, final: 91 },
    { id: 3, name: 'Hassan Ahmed', email: 'hassan@example.com', assignment1: 88, assignment2: 90, midterm: 85, final: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-6xl mx-auto">
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📋 Gradebook View
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              View all student grades in one place
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-6">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                      <TableCell className="font-bold">Student Name</TableCell>
                      <TableCell align="center" className="font-bold">Assignment 1</TableCell>
                      <TableCell align="center" className="font-bold">Assignment 2</TableCell>
                      <TableCell align="center" className="font-bold">Midterm</TableCell>
                      <TableCell align="center" className="font-bold">Final</TableCell>
                      <TableCell align="center" className="font-bold">Average</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, i) => {
                      const grades = [student.assignment1, student.assignment2, student.midterm, student.final].filter(g => g !== null);
                      const average = grades.length > 0 ? Math.round(grades.reduce((a, b) => a + b) / grades.length) : 0;
                      return (
                        <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="text-gray-900 dark:text-white">{student.name}</TableCell>
                          <TableCell align="center">{student.assignment1}</TableCell>
                          <TableCell align="center">{student.assignment2}</TableCell>
                          <TableCell align="center">{student.midterm}</TableCell>
                          <TableCell align="center">{student.final || '-'}</TableCell>
                          <TableCell align="center" className="font-bold text-blue-600 dark:text-blue-400">{average}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
