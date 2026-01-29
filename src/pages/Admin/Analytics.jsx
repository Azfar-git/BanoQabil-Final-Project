import React from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

export default function Analytics() {
  const chartData = [
    { month: 'Jan', students: 240, assignments: 120, grades: 95 },
    { month: 'Feb', students: 280, assignments: 140, grades: 98 },
    { month: 'Mar', students: 320, assignments: 160, grades: 105 },
    { month: 'Apr', students: 350, assignments: 180, grades: 110 },
  ];

  const stats = [
    { title: 'Total Students', value: '350', change: '+12 this month', color: 'bg-blue-100 dark:bg-blue-900' },
    { title: 'Assignments Created', value: '24', change: '+3 this month', color: 'bg-green-100 dark:bg-green-900' },
    { title: 'Avg Grade', value: '82%', change: '+2% improvement', color: 'bg-purple-100 dark:bg-purple-900' },
    { title: 'Classes', value: '8', change: '+1 new class', color: 'bg-orange-100 dark:bg-orange-900' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-7xl mx-auto">
          {/* Header */}
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📊 Analytics Dashboard
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
              System-wide performance metrics and insights
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} className="mb-8">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="dark:bg-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Box className={`${stat.color} p-4 rounded-lg mb-4 w-fit`}>
                        <Typography variant="h6" className="text-gray-900 dark:text-white font-bold">
                          {stat.value}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                        {stat.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                        {stat.change}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                    Monthly Growth
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                    Performance Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="grades" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
