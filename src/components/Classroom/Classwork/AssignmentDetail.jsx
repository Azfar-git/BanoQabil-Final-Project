import React, { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, Chip, Avatar, AvatarGroup } from '@mui/material';
import { Download as DownloadIcon, Share as ShareIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AssignmentDetail = ({ assignmentId }) => {
  const [tabValue, setTabValue] = useState(0);

  const assignment = {
    id: assignmentId,
    title: 'Web Development Project',
    description: 'Create a responsive website with HTML, CSS, and JavaScript. The website should include navigation, multiple pages, and interactive elements.',
    dueDate: new Date('2026-02-15'),
    points: 100,
    status: 'active',
    attachments: [
      { id: 1, name: 'project-requirements.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 2, name: 'starter-code.zip', size: '5.1 MB', type: 'zip' },
    ],
    submissions: [
      { id: 1, studentName: 'John Doe', submittedAt: new Date('2026-02-10'), grade: 95, avatar: 'https://i.pravatar.cc/40?img=1' },
      { id: 2, studentName: 'Jane Smith', submittedAt: new Date('2026-02-12'), grade: 87, avatar: 'https://i.pravatar.cc/40?img=2' },
      { id: 3, studentName: 'Bob Johnson', submittedAt: new Date('2026-02-14'), grade: null, avatar: 'https://i.pravatar.cc/40?img=3' },
    ],
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const due = new Date(assignment.dueDate);
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl">
        {/* Header */}
        <Box className="flex justify-between items-start mb-6">
          <Box>
            <Typography variant="h5" className="font-bold mb-2 text-gray-900 dark:text-white">
              {assignment.title}
            </Typography>
            <Box className="flex gap-2">
              <Chip label={`${assignment.points} points`} color="primary" />
              <Chip
                label={getDaysUntilDue() > 0 ? `${getDaysUntilDue()} days left` : 'Overdue'}
                color={getDaysUntilDue() > 0 ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box className="flex gap-2">
            <Button variant="outlined" startIcon={<ShareIcon />}>
              Share
            </Button>
            <Button variant="outlined" startIcon={<MoreVertIcon />}>
              More
            </Button>
          </Box>
        </Box>

        {/* Description */}
        <Box className="mb-6">
          <Typography variant="h6" className="font-semibold mb-2 text-gray-900 dark:text-white">
            Instructions
          </Typography>
          <Typography variant="body2" className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {assignment.description}
          </Typography>
        </Box>

        {/* Due Date */}
        <Box className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">
          <Typography variant="body2" className="text-blue-600 dark:text-blue-300">
            📅 Due: {assignment.dueDate.toLocaleDateString()} at 11:59 PM
          </Typography>
        </Box>

        {/* Tabs */}
        <Box className="mb-6">
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Materials" />
            <Tab label="Submissions" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-3">
              Attachments ({assignment.attachments.length})
            </Typography>
            {assignment.attachments.map((file) => (
              <Box key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded mb-2">
                <Typography variant="body2">{file.name}</Typography>
                <Box className="flex items-center gap-2">
                  <Typography variant="caption" className="text-gray-500">{file.size}</Typography>
                  <Button size="small" startIcon={<DownloadIcon />}>Download</Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-3">
              Student Submissions ({assignment.submissions.length})
            </Typography>
            <AvatarGroup max={4} className="mb-4">
              {assignment.submissions.map((sub) => (
                <Avatar key={sub.id} src={sub.avatar} alt={sub.studentName} />
              ))}
            </AvatarGroup>
            {assignment.submissions.map((submission) => (
              <Box key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded mb-2">
                <Box>
                  <Typography variant="body2" className="font-semibold">{submission.studentName}</Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Submitted: {submission.submittedAt.toLocaleDateString()}
                  </Typography>
                </Box>
                {submission.grade !== null ? (
                  <Chip label={`${submission.grade}/100`} color="success" />
                ) : (
                  <Chip label="Pending Review" variant="outlined" />
                )}
              </Box>
            ))}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-3">
              Class Statistics
            </Typography>
            <Box className="grid grid-cols-3 gap-4">
              <Box className="p-4 bg-green-50 dark:bg-green-900 rounded text-center">
                <Typography variant="h6" className="font-bold text-green-700 dark:text-green-200">
                  {assignment.submissions.filter(s => s.grade).length}
                </Typography>
                <Typography variant="caption" className="text-green-600 dark:text-green-300">
                  Graded
                </Typography>
              </Box>
              <Box className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded text-center">
                <Typography variant="h6" className="font-bold text-yellow-700 dark:text-yellow-200">
                  {assignment.submissions.filter(s => !s.grade).length}
                </Typography>
                <Typography variant="caption" className="text-yellow-600 dark:text-yellow-300">
                  Pending
                </Typography>
              </Box>
              <Box className="p-4 bg-blue-50 dark:bg-blue-900 rounded text-center">
                <Typography variant="h6" className="font-bold text-blue-700 dark:text-blue-200">
                  90
                </Typography>
                <Typography variant="caption" className="text-blue-600 dark:text-blue-300">
                  Avg Grade
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default AssignmentDetail;
