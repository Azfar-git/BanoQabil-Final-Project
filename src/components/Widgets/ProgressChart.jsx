import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ProgressChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate sample progress data
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        progress: Math.floor(Math.random() * 40) + 60,
      });
    }
    setChartData(data);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
          Student Progress Overview
        </Typography>
        
        <Box className="mb-6">
          <Box className="flex justify-between items-center mb-2">
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
              Overall Class Progress
            </Typography>
            <Typography variant="body2" className="font-semibold text-gray-900 dark:text-white">
              78%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={78} className="h-2" />
        </Box>

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  color: '#fff'
                }} 
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <Box className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm">
          <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
            📊 Average improvement: +5% this month
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProgressChart;
