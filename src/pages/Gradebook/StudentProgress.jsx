import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function StudentProgress() {
  const progressData = [
    { subject: 'Assignments', progress: 85, color: 'bg-blue-500' },
    { subject: 'Quizzes', progress: 78, color: 'bg-purple-500' },
    { subject: 'Midterm', progress: 92, color: 'bg-green-500' },
    { subject: 'Projects', progress: 88, color: 'bg-orange-500' },
  ];

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
              📈 Student Progress
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Track your learning progress across all categories
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {progressData.map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="dark:bg-gray-800 h-full">
                    <CardContent className="p-6">
                      <Box className="flex justify-between items-center mb-3">
                        <Typography className="text-gray-900 dark:text-white font-semibold">
                          {item.subject}
                        </Typography>
                        <Typography className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {item.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        className={`h-3 ${item.color}`}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Overall Progress */}
          <Card className="dark:bg-gray-800 mt-6">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                Overall Progress
              </Typography>
              <Box className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white">
                <Typography className="text-3xl font-bold mb-2">
                  86%
                </Typography>
                <Typography>
                  You're doing great! Keep up the excellent work.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
