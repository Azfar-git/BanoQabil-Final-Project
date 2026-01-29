import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Checkbox, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';

const GradeSettings = () => {
  const [settings, setSettings] = useState({
    totalPoints: 100,
    gradeScale: 'standard',
    decimalPlaces: 2,
    showAverageToStudents: true,
    allowStudentsToViewGrades: true,
    notifyStudentsOfGrades: true,
  });

  const handleToggle = (field) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl">
        <Typography variant="h6" className="font-semibold mb-6 text-gray-900 dark:text-white">
          Grade Settings
        </Typography>

        <Box className="space-y-4">
          {/* Total Points */}
          <Box className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-900 dark:text-white">
              Total Points
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-3">
              Set the maximum points for all assignments in this class
            </Typography>
            <input
              type="number"
              value={settings.totalPoints}
              onChange={(e) => handleChange('totalPoints', parseInt(e.target.value))}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            />
          </Box>

          {/* Grade Scale */}
          <Box className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-900 dark:text-white">
              Grade Scale
            </Typography>
            <FormControl fullWidth>
              <Select
                value={settings.gradeScale}
                onChange={(e) => handleChange('gradeScale', e.target.value)}
              >
                <MenuItem value="standard">Standard (A-F)</MenuItem>
                <MenuItem value="percentage">Percentage (0-100%)</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Decimal Places */}
          <Box className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-900 dark:text-white">
              Decimal Places
            </Typography>
            <Select
              value={settings.decimalPlaces}
              onChange={(e) => handleChange('decimalPlaces', e.target.value)}
              fullWidth
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </Box>

          {/* Student Visibility */}
          <Box className="space-y-3 border-t dark:border-gray-700 pt-4">
            <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white">
              Student Visibility
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.showAverageToStudents}
                  onChange={(e) => handleToggle('showAverageToStudents')}
                />
              }
              label="Show class average to students"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.allowStudentsToViewGrades}
                  onChange={(e) => handleToggle('allowStudentsToViewGrades')}
                />
              }
              label="Allow students to view their grades"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.notifyStudentsOfGrades}
                  onChange={(e) => handleToggle('notifyStudentsOfGrades')}
                />
              }
              label="Notify students when grades are posted"
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="mt-6 flex gap-2">
          <Button variant="outlined">Reset to Default</Button>
          <Button variant="contained" color="primary">
            Save Settings
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default GradeSettings;
