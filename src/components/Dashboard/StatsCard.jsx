import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, change, icon, color = 'primary' }) => {
  const colorMap = {
    primary: { bg: 'bg-blue-50', text: 'text-blue-600', chip: 'bg-blue-100' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-600', chip: 'bg-yellow-100' },
    success: { bg: 'bg-green-50', text: 'text-green-600', chip: 'bg-green-100' },
    error: { bg: 'bg-red-50', text: 'text-red-600', chip: 'bg-red-100' },
  };

  const currentColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full ${currentColor.bg}`}>
        <CardContent className="p-6">
          <Box className="flex justify-between items-start mb-4">
            <Box>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
                {title}
              </Typography>
              <Typography variant="h4" className="font-bold mb-2">
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
            sx={{
              borderColor: 'currentColor',
              color: currentColor.text,
              fontSize: '0.75rem',
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
