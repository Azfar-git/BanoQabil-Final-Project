import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, change, icon, color = 'primary', darkMode }) => {
  const colorMap = {
    primary: { 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      text: 'text-blue-600 dark:text-blue-400', 
      chip: 'bg-blue-100 dark:bg-blue-800/30' 
    },
    warning: { 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      chip: 'bg-yellow-100 dark:bg-yellow-800/30' 
    },
    success: { 
      bg: 'bg-green-50 dark:bg-green-900/20', 
      text: 'text-green-600 dark:text-green-400', 
      chip: 'bg-green-100 dark:bg-green-800/30' 
    },
    error: { 
      bg: 'bg-red-50 dark:bg-red-900/20', 
      text: 'text-red-600 dark:text-red-400', 
      chip: 'bg-red-100 dark:bg-red-800/30' 
    },
  };

  const currentColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full ${currentColor.bg} dark:border-gray-700`}>
        <CardContent className="p-6">
          <Box className="flex justify-between items-start mb-4">
            <Box>
              <Typography 
                variant="body2" 
                className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {value}
              </Typography>
            </Box>
            <Box className={`p-3 rounded-lg ${currentColor.chip} flex items-center justify-center`}>
              <Box className={`${currentColor.text}`} sx={{ fontSize: '24px' }}>
                {icon}
              </Box>
            </Box>
          </Box>
          <Chip
            label={change}
            size="small"
            variant="outlined"
            className={`${currentColor.text} ${currentColor.chip} border-current`}
            sx={{
              fontSize: '0.75rem',
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;