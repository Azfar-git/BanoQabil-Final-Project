import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Tabs, Tab, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { DUMMY_GRADES, DUMMY_STUDENTS } from '../../data/dummyData';

export default function ClassroomGrades() {
  const { id } = useParams();
  const [grades] = useState(DUMMY_GRADES);
  const [tabValue, setTabValue] = useState(0);

  // Group grades by assignment
  const assignments = [...new Set(grades.map(g => g.assignment))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-4xl mx-auto">
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📊 Class Grades
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              View grades for this class
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="My Grades" />
              <Tab label="Class Average" />
              <Tab label="Grade Distribution" />
            </Tabs>

            <CardContent className="p-6">
              {tabValue === 0 && (
                <Box>
                  <Box className="space-y-4">
                    {[
                      { assignment: 'Assignment 1', grade: 95, total: 100 },
                      { assignment: 'Assignment 2', grade: 88, total: 100 },
                      { assignment: 'Midterm', grade: 92, total: 100 },
                    ].map((item, i) => (
                      <Box key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                        <Box className="flex justify-between mb-2">
                          <Typography className="text-gray-900 dark:text-white font-semibold">
                            {item.assignment}
                          </Typography>
                          <Typography className="text-green-600 dark:text-green-400 font-bold">
                            {item.grade}/{item.total}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(item.grade / item.total) * 100}
                          className="h-2"
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Box className="p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">
                    <Typography className="text-blue-600 dark:text-blue-200 font-bold text-2xl">
                      85%
                    </Typography>
                    <Typography className="text-blue-600 dark:text-blue-200">
                      Class Average Grade
                    </Typography>
                  </Box>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Box className="space-y-3">
                    {[
                      { grade: 'A (90-100)', count: 8, percentage: 32 },
                      { grade: 'B (80-89)', count: 12, percentage: 48 },
                      { grade: 'C (70-79)', count: 4, percentage: 16 },
                      { grade: 'D (60-69)', count: 1, percentage: 4 },
                    ].map((item, i) => (
                      <Box key={i}>
                        <Box className="flex justify-between mb-1">
                          <Typography className="text-gray-900 dark:text-white font-semibold">
                            {item.grade}
                          </Typography>
                          <Typography className="text-gray-600 dark:text-gray-400">
                            {item.count} students
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          className="h-6"
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
