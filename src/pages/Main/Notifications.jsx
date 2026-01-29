import React from 'react';
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { DUMMY_NOTIFICATIONS } from '../../data/dummyData';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(DUMMY_NOTIFICATIONS);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-2xl mx-auto">
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>🔔 Notifications</Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
            {notifications.filter(n => !n.read).length} unread notifications
          </Typography>

          <Box className="space-y-3">
            {notifications.map((n,i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`dark:bg-gray-800 ${!n.read ? 'border-l-4 border-blue-500' : ''}`}>
                  <CardContent className="flex justify-between items-start">
                    <Box>
                      <Typography className={`font-semibold text-gray-900 dark:text-white ${!n.read ? 'text-blue-600' : ''}`}>
                        {n.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">{n.message}</Typography>
                      <Typography variant="caption" className="text-gray-500 mt-1 block">{new Date(n.timestamp).toLocaleString()}</Typography>
                    </Box>
                    <Box className="flex gap-1">
                      {!n.read && (
                        <IconButton size="small" onClick={() => markAsRead(n.id)} className="text-blue-600">
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" onClick={() => deleteNotification(n.id)} className="text-red-600">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}