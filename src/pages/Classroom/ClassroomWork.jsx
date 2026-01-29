import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Tabs, Tab, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { DUMMY_ASSIGNMENTS } from '../../data/dummyData';

export default function ClassroomWork() {
  const { id } = useParams();
  const [assignments] = useState(DUMMY_ASSIGNMENTS.filter(a => a.classId === id));
  const [tabValue, setTabValue] = useState(0);

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
              📚 Class Work
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Assignments, quizzes, and materials for this class
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Assignments" />
              <Tab label="Materials" />
            </Tabs>

            <CardContent className="p-6">
              {tabValue === 0 && (
                <Box className="space-y-3">
                  {assignments.map((assignment, i) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Box className="p-4 bg-gray-50 dark:bg-gray-700 rounded hover:shadow-md transition-shadow cursor-pointer">
                        <Box className="flex justify-between items-start mb-2">
                          <Box>
                            <Typography className="text-gray-900 dark:text-white font-semibold">
                              {assignment.title}
                            </Typography>
                            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                              Due: {assignment.dueDate.toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={assignment.status === 'open' ? 'Open' : 'Closed'}
                            color={assignment.status === 'open' ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mb-2">
                          {assignment.description}
                        </Typography>
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                          {assignment.totalPoints} points • {assignment.submissions} submissions
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              )}

              {tabValue === 1 && (
                <Box className="space-y-3">
                  {[
                    { name: 'Lecture Notes - Week 1.pdf', size: '2.4 MB' },
                    { name: 'Starter Code.zip', size: '5.1 MB' },
                    { name: 'Reference Links.docx', size: '0.8 MB' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Box className="p-4 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center hover:shadow-md transition-shadow">
                        <Box>
                          <Typography className="text-gray-900 dark:text-white font-semibold">
                            {item.name}
                          </Typography>
                          <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                            {item.size}
                          </Typography>
                        </Box>
                        <Button size="small" variant="outlined">Download</Button>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
