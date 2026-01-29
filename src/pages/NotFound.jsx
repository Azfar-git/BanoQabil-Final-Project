import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
        <Box className="text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h1" className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              404
            </Typography>
          </motion.div>
          <Typography variant="h4" className="text-white mb-4 font-semibold">
            Oops! Page Not Found
          </Typography>
          <Typography variant="body1" className="text-gray-400 mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </Typography>
          <Button
            variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
