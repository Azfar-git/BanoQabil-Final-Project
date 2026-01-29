import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Card, CardContent, Avatar, Divider, FormControlLabel, Checkbox } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Security as SecurityIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function AccountSettings() {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Muhammad Ali',
    email: 'ali@example.com',
    phone: '+92 300 1234567',
    bio: 'Computer Science Student',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-2xl mx-auto">
          {/* Header */}
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              ⚙️ Account Settings
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
              Manage your account information and security settings
            </Typography>
          </Box>

          {/* Profile Section */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-6">
              <Box className="flex items-center gap-6 mb-6">
                <Avatar sx={{ width: 100, height: 100 }} src="https://i.pravatar.cc/100" />
                <Box>
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    {userData.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    {userData.email}
                  </Typography>
                  <Button size="small" className="mt-2">Change Avatar</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-6">
              <Box className="flex justify-between items-center mb-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  Personal Information
                </Typography>
                <Button
                  startIcon={editing ? <SaveIcon /> : <EditIcon />}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? 'Save' : 'Edit'}
                </Button>
              </Box>

              <Box className="space-y-4">
                <TextField
                  label="Full Name"
                  fullWidth
                  value={userData.name}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                <TextField
                  label="Email"
                  fullWidth
                  value={userData.email}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
                <TextField
                  label="Phone"
                  fullWidth
                  value={userData.phone}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  rows={3}
                  value={userData.bio}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <SecurityIcon /> Security
              </Typography>
              <Box className="space-y-4">
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white mb-2">
                    Password
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Change Password
                  </Button>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white mb-2">
                    Two-Factor Authentication
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Enable 2FA for added security"
                  />
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white mb-2">
                    Active Sessions
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                    Sign out from all other devices
                  </Typography>
                  <Button variant="contained" color="error">
                    Sign Out All Devices
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
