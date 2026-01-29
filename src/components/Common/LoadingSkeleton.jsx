import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ count = 3, variant = 'card' }) => {
  if (variant === 'card') {
    return (
      <Box className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Box className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <Skeleton variant="text" height={32} className="mb-2" />
              <Skeleton variant="text" height={20} width="80%" className="mb-2" />
              <Skeleton variant="rectangular" height={100} />
            </Box>
          </motion.div>
        ))}
      </Box>
    );
  }

  if (variant === 'text') {
    return (
      <Box className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="text" height={24} />
        ))}
      </Box>
    );
  }

  if (variant === 'avatar') {
    return (
      <Box className="flex gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="circular" width={40} height={40} />
        ))}
      </Box>
    );
  }

  return null;
};

export default LoadingSkeleton;
