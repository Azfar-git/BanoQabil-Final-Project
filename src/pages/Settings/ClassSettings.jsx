import React from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { motion } from 'framer-motion';

export default function ClassSettings() {
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
              ⚙️ Class Settings
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your class preferences and settings
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800 mb-6">
            <CardContent className="p-6 space-y-6">
              {/* Class Info */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Class Information
                </Typography>
                <Box className="space-y-3">
                  <TextField
                    fullWidth
                    label="Class Name"
                    defaultValue="Introduction to Web Development"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Class Code"
                    defaultValue="abc123xyz"
                    disabled
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    defaultValue="Learn web development fundamentals"
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Enrollment Settings */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Enrollment
                </Typography>
                <Box className="space-y-2">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Allow students to join with class code"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Allow students to resubmit assignments"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Archive this class"
                  />
                </Box>
              </Box>

              <Divider />

              {/* Notification Settings */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Notifications
                </Typography>
                <Box className="space-y-2">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Notify all students on assignment changes"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Notify on new student submissions"
                  />
                </Box>
              </Box>

              <Box className="pt-4 flex gap-4">
                <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold">
                  Save Settings
                </Button>
                <Button variant="outlined">
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
