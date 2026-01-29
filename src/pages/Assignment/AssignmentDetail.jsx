import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Chip, Avatar, AvatarGroup, Divider, Tab, Tabs } from '@mui/material';
import { ArrowBack as BackIcon, Download as DownloadIcon, Share as ShareIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  const assignment = {
    title: 'Web Development Project',
    description: 'Create a responsive website using HTML, CSS, and JavaScript with React framework.',
    dueDate: '2026-02-15',
    points: 100,
    submissions: 28,
    graded: 15,
    attachments: 2,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-4xl mx-auto">
          {/* Header */}
          <Box className="flex items-center gap-4 mb-8">
            <Button startIcon={<BackIcon />} onClick={() => navigate('/assignments')}>
              Back
            </Button>
            <Box className="flex-1">
              <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {assignment.title}
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<ShareIcon />}>
              Share
            </Button>
          </Box>

          {/* Main Card */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-8">
              {/* Description */}
              <Box className="mb-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-2">
                  Assignment Description
                </Typography>
                <Typography className="text-gray-700 dark:text-gray-300">
                  {assignment.description}
                </Typography>
              </Box>

              <Divider className="my-6" />

              {/* Details */}
              <Box className="grid grid-cols-2 gap-6 mb-6">
                <Box>
                  <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                    Due Date
                  </Typography>
                  <Typography className="text-gray-900 dark:text-white font-semibold">
                    {assignment.dueDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                    Total Points
                  </Typography>
                  <Typography className="text-gray-900 dark:text-white font-semibold">
                    {assignment.points} pts
                  </Typography>
                </Box>
              </Box>

              {/* Status Chips */}
              <Box className="flex gap-2">
                <Chip label={`${assignment.submissions} submissions`} color="primary" />
                <Chip label={`${assignment.graded} graded`} color="success" />
                <Chip label={`${assignment.attachments} files`} variant="outlined" />
              </Box>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card className="dark:bg-gray-800">
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Submissions" />
              <Tab label="Materials" />
              <Tab label="Analytics" />
            </Tabs>

            <CardContent className="p-6">
              {tabValue === 0 && (
                <Box>
                  <Typography variant="subtitle2" className="font-bold mb-4">
                    Student Submissions
                  </Typography>
                  <Box className="space-y-3">
                    {[
                      { name: 'Muhammad Ali', submitted: true, grade: 95 },
                      { name: 'Fatima Khan', submitted: true, grade: 88 },
                      { name: 'Hassan Ahmed', submitted: false, grade: null },
                    ].map((student, i) => (
                      <Box key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                        <Typography className="text-gray-900 dark:text-white font-semibold">
                          {student.name}
                        </Typography>
                        {student.submitted ? (
                          <Chip label={`Grade: ${student.grade}`} color="success" />
                        ) : (
                          <Chip label="Not Submitted" variant="outlined" color="error" />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="subtitle2" className="font-bold mb-4">
                    Course Materials
                  </Typography>
                  <Box className="space-y-2">
                    <Box className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                      <Typography className="text-gray-900 dark:text-white">project-requirements.pdf</Typography>
                      <Button size="small" startIcon={<DownloadIcon />}>Download</Button>
                    </Box>
                    <Box className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                      <Typography className="text-gray-900 dark:text-white">starter-code.zip</Typography>
                      <Button size="small" startIcon={<DownloadIcon />}>Download</Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography variant="subtitle2" className="font-bold mb-4">
                    Assignment Statistics
                  </Typography>
                  <Box className="grid grid-cols-3 gap-4">
                    <Box className="p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">
                      <Typography className="text-blue-600 dark:text-blue-200 text-sm font-bold">
                        {assignment.submissions}
                      </Typography>
                      <Typography variant="caption" className="text-blue-600 dark:text-blue-200">
                        Total Submissions
                      </Typography>
                    </Box>
                    <Box className="p-4 bg-green-50 dark:bg-green-900 rounded text-center">
                      <Typography className="text-green-600 dark:text-green-200 text-sm font-bold">
                        {assignment.graded}
                      </Typography>
                      <Typography variant="caption" className="text-green-600 dark:text-green-200">
                        Graded
                      </Typography>
                    </Box>
                    <Box className="p-4 bg-orange-50 dark:bg-orange-900 rounded text-center">
                      <Typography className="text-orange-600 dark:text-orange-200 text-sm font-bold">
                        {assignment.submissions - assignment.graded}
                      </Typography>
                      <Typography variant="caption" className="text-orange-600 dark:text-orange-200">
                        Pending
                      </Typography>
                    </Box>
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
