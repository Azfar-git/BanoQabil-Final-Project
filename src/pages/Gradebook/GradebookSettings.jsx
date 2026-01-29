import React from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { motion } from 'framer-motion';

export default function GradebookSettings() {
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
              ⚙️ Gradebook Settings
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Configure grade scales and display options
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 space-y-6">
              {/* Grade Scale */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Grade Scale
                </Typography>
                <Box className="space-y-3">
                  {[
                    { label: 'A', value: 90 },
                    { label: 'B', value: 80 },
                    { label: 'C', value: 70 },
                    { label: 'D', value: 60 },
                  ].map((item) => (
                    <Box key={item.label} className="flex gap-4 items-center">
                      <Typography className="w-12 text-gray-900 dark:text-white font-semibold">{item.label}:</Typography>
                      <TextField
                        defaultValue={item.value}
                        type="number"
                        size="small"
                        className="w-24"
                      />
                      <Typography className="text-gray-600 dark:text-gray-400">%</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Display Options */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Display Options
                </Typography>
                <Box className="space-y-2">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Show average to students"
                    className="text-gray-900 dark:text-white"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Show class average"
                    className="text-gray-900 dark:text-white"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Show grade distribution chart"
                    className="text-gray-900 dark:text-white"
                  />
                </Box>
              </Box>

              <Divider />

              {/* Decimal Places */}
              <Box>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Decimal Places
                </Typography>
                <TextField
                  type="number"
                  defaultValue={2}
                  size="small"
                  className="w-24"
                  inputProps={{ min: 0, max: 4 }}
                />
              </Box>

              <Box className="pt-4 flex gap-4">
                <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold">
                  Save Settings
                </Button>
                <Button variant="outlined">
                  Reset to Defaults
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
