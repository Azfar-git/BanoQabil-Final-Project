import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PeopleIcon from '@mui/icons-material/People';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      label: 'Create Assignment',
      icon: <AssignmentIcon />,
      color: 'primary',
      action: () => console.log('Create assignment'),
    },
    {
      id: 2,
      label: 'Make Announcement',
      icon: <AnnouncementIcon />,
      color: 'success',
      action: () => console.log('Make announcement'),
    },
    {
      id: 3,
      label: 'Invite Students',
      icon: <PeopleIcon />,
      color: 'info',
      action: () => console.log('Invite students'),
    },
    {
      id: 4,
      label: 'Create Class',
      icon: <AddIcon />,
      color: 'warning',
      action: () => console.log('Create class'),
    },
  ];

  return (
    <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
        Quick Actions
      </Typography>
      <Stack spacing={2}>
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={action.icon}
              onClick={action.action}
              className="justify-start"
              color={action.color}
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default QuickActions;
