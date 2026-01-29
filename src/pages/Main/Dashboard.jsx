import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/NotificationsActive";

import { motion } from 'framer-motion';
import ClassGrid from '../../components/Dashboard/ClassGrid';
import ClassTable from '../../components/Dashboard/ClassTable';
import UpcomingAssignments from '../../components/Dashboard/UpcomingAssignments';
import CalendarWidget from '../../components/Dashboard/CalendarWidget';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import StatsCard from '../../components/Dashboard/StatsCard';
import QuickActions from '../../components/Widgets/QuickActions';
import ProgressChart from '../../components/Widgets/ProgressChart';
import { mockClasses, mockAssignments, mockUser, mockAnalytics } from '../../data/mockData';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  const stats = [
    {
      title: 'Active Classes',
      value: mockClasses.length,
      change: '+2 this month',
      icon: <TrendingUpIcon />,
      color: 'primary',
    },
    {
      title: 'Pending Assignments',
      value: mockAssignments.filter(a => a.status === 'pending').length,
      change: '3 due this week',
      icon: <AssignmentIcon />,
      color: 'warning',
    },
    {
      title: 'Upcoming Events',
      value: 5,
      change: 'Next: Tomorrow',
      icon: <EventIcon />,
      color: 'success',
    },
    {
      title: 'Unread Notifications',
      value: 3,
      change: '2 new today',
      icon: <NotificationsIcon />,
      color: 'error',
    },
  ];

  return (
    <Box className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Box>
            <Typography 
              variant="h3" 
              className="font-bold mb-2"
              sx={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome back, {mockUser.name}!
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your classes today
            </Typography>
          </Box>
          <Box className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              className="btn-primary"
            >
              Create Class
            </Button>
            <Button
              variant="outlined"
              className="btn-outline"
            >
              Join Class
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Classes Section */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              {/* Header */}
              <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <Box>
                  <Typography 
                    variant="h5"
                    className="font-bold mb-2"
                    sx={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Your Classes
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    {mockClasses.length} active classes
                  </Typography>
                </Box>
                <Box className="flex items-center gap-3 mt-4 md:mt-0">
                  {/* Filter Chips */}
                  <Box className="flex gap-2">
                    {['all', 'active', 'archived', 'favorites'].map((f) => (
                      <Chip
                        key={f}
                        label={f.charAt(0).toUpperCase() + f.slice(1)}
                        onClick={() => setFilter(f)}
                        color={filter === f ? 'primary' : 'default'}
                        variant={filter === f ? 'filled' : 'outlined'}
                        size="small"
                      />
                    ))}
                  </Box>
                  
                  {/* View Toggle */}
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, value) => value && setViewMode(value)}
                    size="small"
                  >
                    <ToggleButton value="grid">
                      <GridViewIcon />
                    </ToggleButton>
                    <ToggleButton value="list">
                      <ViewListIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>

              {/* Classes Content */}
              {viewMode === 'grid' ? (
                <ClassGrid classes={mockClasses} />
              ) : (
                <ClassTable classes={mockClasses} />
              )}
            </Box>
          </motion.div>
        </Grid>

        {/* Right Sidebar Widgets */}
        <Grid item xs={12} lg={4}>
          <Box className="space-y-4">
            {/* Upcoming Assignments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <UpcomingAssignments />
            </motion.div>

            {/* Calendar Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CalendarWidget />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <QuickActions />
            </motion.div>

            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <ProgressChart data={mockAnalytics} />
            </motion.div>
          </Box>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <RecentActivity />
      </motion.div>
    </Box>
  );
};

export default Dashboard;
