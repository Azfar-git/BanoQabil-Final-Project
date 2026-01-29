import React, { useState } from 'react';
import { Box, Popover, List, ListItem, ListItemIcon, ListItemText, Typography, Chip, Divider, Button } from '@mui/material';
import { Bell as BellIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = ({ anchorEl, open, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'assignment', title: 'New Assignment', message: 'Web Development Project is due in 2 days', read: false, timestamp: new Date(Date.now() - 3600000) },
    { id: 2, type: 'grade', title: 'Grade Posted', message: 'Your quiz score: 95/100', read: false, timestamp: new Date(Date.now() - 7200000) },
    { id: 3, type: 'announcement', title: 'Class Announcement', message: 'Next class will be online', read: true, timestamp: new Date(Date.now() - 86400000) },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'assignment':
        return '📋';
      case 'grade':
        return '📊';
      case 'announcement':
        return '📢';
      default:
        return '🔔';
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ className: 'w-96' }}
    >
      <Box className="bg-white dark:bg-gray-800 w-96 max-h-96 overflow-y-auto">
        {/* Header */}
        <Box className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip label={unreadCount} color="primary" size="small" />
          )}
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List className="p-0">
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem
                    className={`border-b dark:border-gray-700 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900' : ''
                    } hover:bg-gray-50 dark:hover:bg-gray-700`}
                  >
                    <ListItemIcon className="text-2xl mr-2">
                      {getIcon(notification.type)}
                    </ListItemIcon>
                    <Box className="flex-1">
                      <ListItemText
                        primary={notification.title}
                        secondary={notification.message}
                      />
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {!notification.read && (
                      <CheckIcon
                        fontSize="small"
                        className="text-blue-500 cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      />
                    )}
                    <CloseIcon
                      fontSize="small"
                      className="text-gray-400 cursor-pointer ml-2 hover:text-red-500"
                      onClick={() => deleteNotification(notification.id)}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box className="p-4 text-center">
              <Button size="small" className="text-blue-600">
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};

export default NotificationCenter;
