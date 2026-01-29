import React from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Avatar, Divider } from '@mui/material';
import { motion } from 'framer-motion';

export default function ProfileSettings() {
  const [formData, setFormData] = React.useState({
    name: 'Muhammad Ali',
    email: 'ali@student.com',
    phone: '+92-300-1234567',
    bio: 'Computer Science Student',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              👤 Profile Settings
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your profile information
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 space-y-6">
              {/* Profile Picture */}
              <Box className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <Avatar
                  className="w-20 h-20 mx-auto mb-4"
                  sx={{ width: 80, height: 80, fontSize: '2rem' }}
                >
                  {formData.name.charAt(0)}
                </Avatar>
                <Button variant="outlined" size="small">
                  Change Photo
                </Button>
              </Box>

              {/* Personal Information */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </Typography>
                <Box className="space-y-3">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Privacy Settings */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Privacy
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-3">
                  Make your profile visible to:
                </Typography>
                <Box className="space-y-2 ml-4">
                  <Typography className="text-gray-900 dark:text-white text-sm">
                    ⚫ Teachers and classmates only
                  </Typography>
                </Box>
              </Box>

              <Box className="pt-4 flex gap-4">
                <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold">
                  Save Changes
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
