import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, School as SchoolIcon, Settings as SettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MobileDrawer = ({ open, onClose }) => {
  const menuItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', href: '/' },
    { icon: <SchoolIcon />, label: 'Classes', href: '/classes' },
    { icon: <SchoolIcon />, label: 'Grades', href: '/grades' },
    { icon: <SettingsIcon />, label: 'Settings', href: '/settings' },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box className="w-64 h-full bg-white dark:bg-gray-800" role="presentation">
        {/* Header */}
        <Box className="p-4 bg-blue-600 text-white">
          <Typography variant="h6" className="font-bold">
            Google Classroom
          </Typography>
        </Box>

        {/* Menu Items */}
        <List className="p-0">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <ListItemIcon className="text-blue-600 dark:text-blue-400">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Divider />

        {/* Logout */}
        <List className="p-0">
          <ListItem button className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 m-2 rounded">
            <ListItemIcon className="text-red-600 dark:text-red-400">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
