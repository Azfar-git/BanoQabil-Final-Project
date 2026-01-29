import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Card, CardContent, Chip, Avatar, TextField, InputAdornment } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState([
    { id: 1, name: 'Muhammad Ali', email: 'ali@example.com', role: 'student', avatar: 'https://i.pravatar.cc/40?img=1', status: 'active' },
    { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', role: 'teacher', avatar: 'https://i.pravatar.cc/40?img=2', status: 'active' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'https://i.pravatar.cc/40?img=3', status: 'active' },
  ]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                👥 User Management
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                Manage system users and their roles
              </Typography>
            </Box>
            <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold" startIcon={<AddIcon />} size="large">
              Add User
            </Button>
          </Box>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search users..."
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

          {/* Users Table */}
          <Card className="dark:bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <Box className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-700">
                      <TableCell className="font-bold text-gray-900 dark:text-white">User</TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">Email</TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">Role</TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">Status</TableCell>
                      <TableCell align="right" className="font-bold text-gray-900 dark:text-white">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        component="tr"
                      >
                        <TableCell>
                          <Box className="flex items-center gap-3">
                            <Avatar src={user.avatar} alt={user.name} />
                            <Typography className="text-gray-900 dark:text-white font-semibold">
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Chip label={user.role} color="primary" variant="outlined" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={user.status} color="success" size="small" />
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
