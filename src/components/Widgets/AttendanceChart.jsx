import React, { useState } from 'react';
import { Box, Typography, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AttendanceChart = () => {
  const [attendanceData] = useState([
    { date: 'Week 1', present: 24, absent: 4, late: 2 },
    { date: 'Week 2', present: 26, absent: 2, late: 0 },
    { date: 'Week 3', present: 25, absent: 3, late: 2 },
    { date: 'Week 4', present: 27, absent: 1, late: 2 },
    { date: 'Week 5', present: 28, absent: 0, late: 0 },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
          Attendance Overview
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '0.5rem',
                color: '#fff'
              }} 
            />
            <Legend />
            <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="late" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <Box className="mt-4 grid grid-cols-3 gap-4">
          <Box className="p-3 bg-green-50 dark:bg-green-900 rounded">
            <Typography variant="caption" className="text-green-600 dark:text-green-300 block">
              Average Present
            </Typography>
            <Typography variant="h6" className="font-bold text-green-700 dark:text-green-200">
              86%
            </Typography>
          </Box>
          <Box className="p-3 bg-red-50 dark:bg-red-900 rounded">
            <Typography variant="caption" className="text-red-600 dark:text-red-300 block">
              Average Absent
            </Typography>
            <Typography variant="h6" className="font-bold text-red-700 dark:text-red-200">
              10%
            </Typography>
          </Box>
          <Box className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded">
            <Typography variant="caption" className="text-yellow-600 dark:text-yellow-300 block">
              Average Late
            </Typography>
            <Typography variant="h6" className="font-bold text-yellow-700 dark:text-yellow-200">
              4%
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AttendanceChart;
