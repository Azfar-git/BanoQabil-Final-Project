import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';

export default function GradingPage() {
  const submissions = [
    { id: 1, student: 'Muhammad Ali', submitted: true, grade: null, createdAt: '2026-02-10' },
    { id: 2, student: 'Fatima Khan', submitted: true, grade: 95, createdAt: '2026-02-09' },
    { id: 3, student: 'Hassan Ahmed', submitted: true, grade: null, createdAt: '2026-02-11' },
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
              ✅ Grading Page
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Grade student submissions for the assignment
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {submissions.map((submission, index) => (
              <Grid item xs={12} sm={6} lg={4} key={submission.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="dark:bg-gray-800 h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                        {submission.student}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                        Submitted: {submission.createdAt}
                      </Typography>
                      {submission.grade ? (
                        <Box className="p-3 bg-green-50 dark:bg-green-900 rounded mb-4">
                          <Typography className="text-green-700 dark:text-green-200 font-bold">
                            Grade: {submission.grade}/100
                          </Typography>
                        </Box>
                      ) : (
                        <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold" fullWidth>
                          Grade Submission
                        </Button>
                      )}
                      <Button variant="outlined" fullWidth>
                        View Files
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
