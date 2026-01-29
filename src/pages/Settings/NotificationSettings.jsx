import React from 'react';
import { Box, Typography, Card, CardContent, FormControlLabel, Checkbox, Switch, Divider } from '@mui/material';
import { motion } from 'framer-motion';

export default function NotificationSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-2xl mx-auto">
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              🔔 Notification Settings
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Control how and when you receive notifications
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 space-y-6">
              {/* Email Notifications */}
              <Box>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    📧 Email Notifications
                  </Typography>
                  <Switch defaultChecked />
                </Box>
                <Box className="space-y-2 ml-4">
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Assignment due soon" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="New grades posted" />
                  <FormControlLabel control={<Checkbox />} label="Class announcements" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Teacher messages" />
                </Box>
              </Box>

              <Divider />

              {/* Browser Notifications */}
              <Box>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    💻 Browser Notifications
                  </Typography>
                  <Switch defaultChecked />
                </Box>
                <Box className="space-y-2 ml-4">
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Important updates" />
                  <FormControlLabel control={<Checkbox />} label="Grade changes" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Assignment deadlines" />
                </Box>
              </Box>

              <Divider />

              {/* Notification Frequency */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  ⏰ Notification Frequency
                </Typography>
                <Box className="space-y-2 ml-4">
                  <FormControlLabel control={<Checkbox />} label="Instant notifications" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Daily digest" />
                  <FormControlLabel control={<Checkbox />} label="Weekly digest" />
                </Box>
              </Box>

              <Divider />

              {/* Quiet Hours */}
              <Box>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    🤫 Quiet Hours
                  </Typography>
                  <Switch />
                </Box>
                <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                  No notifications between 10:00 PM and 8:00 AM
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
