import React from 'react';
import { Box, Typography, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const GradeDistribution = ({ grades = [] }) => {
  // Sample grade distribution data
  const distributionData = [
    { range: 'A (90-100)', count: 8, color: '#10b981' },
    { range: 'B (80-89)', count: 12, color: '#3b82f6' },
    { range: 'C (70-79)', count: 6, color: '#f59e0b' },
    { range: 'D (60-69)', count: 3, color: '#ef4444' },
    { range: 'F (Below 60)', count: 1, color: '#6b7280' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Typography variant="h6" className="font-semibold mb-6 text-gray-900 dark:text-white">
          Grade Distribution
        </Typography>

        {/* Charts Container */}
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
              By Grade Range
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Pie Chart */}
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Distribution Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Statistics */}
        <Box className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Box className="p-3 bg-green-50 dark:bg-green-900 rounded">
            <Typography variant="caption" className="text-green-600 dark:text-green-300 block">
              Average Grade
            </Typography>
            <Typography variant="h6" className="font-bold text-green-700 dark:text-green-200">
              82.5
            </Typography>
          </Box>
          <Box className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
            <Typography variant="caption" className="text-blue-600 dark:text-blue-300 block">
              Highest Grade
            </Typography>
            <Typography variant="h6" className="font-bold text-blue-700 dark:text-blue-200">
              98
            </Typography>
          </Box>
          <Box className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded">
            <Typography variant="caption" className="text-yellow-600 dark:text-yellow-300 block">
              Lowest Grade
            </Typography>
            <Typography variant="h6" className="font-bold text-yellow-700 dark:text-yellow-200">
              45
            </Typography>
          </Box>
          <Box className="p-3 bg-purple-50 dark:bg-purple-900 rounded">
            <Typography variant="caption" className="text-purple-600 dark:text-purple-300 block">
              Total Students
            </Typography>
            <Typography variant="h6" className="font-bold text-purple-700 dark:text-purple-200">
              30
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default GradeDistribution;
