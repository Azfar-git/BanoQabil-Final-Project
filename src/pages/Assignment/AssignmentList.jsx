import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Card, CardContent, Chip, Grid, InputAdornment } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function AssignmentList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments] = useState([
    { id: 1, title: 'Web Development Project', class: 'Web Dev 101', dueDate: '2026-02-15', status: 'active', points: 100 },
    { id: 2, title: 'Algorithm Assignment', class: 'Data Structures', dueDate: '2026-02-10', status: 'active', points: 50 },
    { id: 3, title: 'Midterm Project', class: 'Advanced Math', dueDate: '2026-02-20', status: 'active', points: 150 },
  ]);

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-6xl mx-auto">
          {/* Header */}
          <Box className="flex justify-between items-center mb-8">
            <Box>
              <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                📋 Assignments
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                {assignments.length} total assignments
              </Typography>
            </Box>
            <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold" startIcon={<AddIcon />} size="large">
              Create Assignment
            </Button>
          </Box>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            className="mb-6"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Assignments Grid */}
          <Grid container spacing={3}>
            {filteredAssignments.map((assignment, index) => (
              <Grid item xs={12} sm={6} lg={4} key={assignment.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-2">
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                        {assignment.class}
                      </Typography>
                      <Box className="flex gap-2 mb-4">
                        <Chip label={`${assignment.points} pts`} color="primary" size="small" />
                        <Chip label={assignment.status} color="success" variant="outlined" size="small" />
                      </Box>
                      <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                        Due: {assignment.dueDate}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
