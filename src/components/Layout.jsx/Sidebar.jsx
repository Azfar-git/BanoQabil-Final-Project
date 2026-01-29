import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, Avatar } from '@mui/material';
import { ExpandLess, ExpandMore, Dashboard as DashboardIcon, School as SchoolIcon, Settings as SettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [expandedClass, setExpandedClass] = useState(null);
  const [classes, setClasses] = useState([
    { id: 1, name: 'Web Development', teacher: 'John Doe', unread: 2 },
    { id: 2, name: 'Data Structures', teacher: 'Jane Smith', unread: 0 },
    { id: 3, name: 'Advanced Math', teacher: 'Bob Johnson', unread: 5 },
  ]);

  const handleExpandClick = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const mainMenuItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', href: '/', color: 'text-blue-600' },
    { icon: <SchoolIcon />, label: 'My Classes', href: '/classes', color: 'text-green-600' },
  ];

  return (
    <Box className="w-64 bg-white dark:bg-gray-800 h-screen overflow-y-auto border-r dark:border-gray-700">
      {/* Logo/Header */}
      <Box className="p-4 border-b dark:border-gray-700">
        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
          📚 Classroom
        </Typography>
      </Box>

      {/* Main Menu */}
      <List className="p-0">
        {mainMenuItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem button component={Link} to={item.href} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <ListItemIcon className={item.color}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Box className="border-t dark:border-gray-700 p-4">
        <Typography variant="caption" className="font-semibold text-gray-700 dark:text-gray-300 block mb-3">
          YOUR CLASSES
        </Typography>

        {/* Classes List */}
        <List className="p-0">
          {classes.map((classItem, index) => (
            <motion.div key={classItem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem
                button
                onClick={() => handleExpandClick(classItem.id)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {classItem.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" className="truncate">
                      {classItem.name}
                    </Typography>
                  }
                  secondary={classItem.unread > 0 && <Chip label={classItem.unread} size="small" color="primary" />}
                />
                {expandedClass === classItem.id ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={expandedClass === classItem.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className="bg-gray-50 dark:bg-gray-900">
                  <ListItem button className="pl-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ListItemText primary="Stream" primaryTypographyProps={{ variant: 'caption' }} />
                  </ListItem>
                  <ListItem button className="pl-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ListItemText primary="Classwork" primaryTypographyProps={{ variant: 'caption' }} />
                  </ListItem>
                  <ListItem button className="pl-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ListItemText primary="Grades" primaryTypographyProps={{ variant: 'caption' }} />
                  </ListItem>
                </List>
              </Collapse>
            </motion.div>
          ))}
        </List>
      </Box>

      {/* Settings Section */}
      <Box className="border-t dark:border-gray-700 mt-auto p-4">
        <List className="p-0">
          <ListItem button className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <ListItemIcon className="text-gray-600 dark:text-gray-400">
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ variant: 'body2' }} />
          </ListItem>
          <ListItem button className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
            <ListItemIcon className="text-red-600">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2' }} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
