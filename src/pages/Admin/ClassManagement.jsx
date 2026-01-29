import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Card, CardContent, Chip, TextField, InputAdornment } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function ClassManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [classes] = useState([
    { id: 1, name: 'Web Development 101', teacher: 'John Doe', students: 32, status: 'active' },
    { id: 2, name: 'Data Structures', teacher: 'Jane Smith', students: 28, status: 'active' },
    { id: 3, name: 'Advanced Mathematics', teacher: 'Bob Johnson', students: 25, status: 'active' },
  ]);

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                🏫 Class Management
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                Manage all classes and their details
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} size="large" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold">
              Create Class
            </Button>
          </Box>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search classes..."
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

          {/* Classes Table */}
          <Card className="dark:bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <Box className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-700">
                      <TableCell className="font-bold text-gray-900 dark:text-white">Class Name</TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">Teacher</TableCell>
                      <TableCell align="center" className="font-bold text-gray-900 dark:text-white">Students</TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">Status</TableCell>
                      <TableCell align="right" className="font-bold text-gray-900 dark:text-white">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClasses.map((classItem, index) => (
                      <motion.tr
                        key={classItem.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        component="tr"
                      >
                        <TableCell className="text-gray-900 dark:text-white font-semibold">
                          {classItem.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {classItem.teacher}
                        </TableCell>
                        <TableCell align="center" className="text-gray-600 dark:text-gray-400">
                          {classItem.students}
                        </TableCell>
                        <TableCell>
                          <Chip label={classItem.status} color="success" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Button size="small" startIcon={<EditIcon />}>Edit</Button>
                          <Button size="small" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
