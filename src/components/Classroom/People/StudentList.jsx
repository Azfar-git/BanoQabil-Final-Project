import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, Button, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StudentList = ({ classId, students = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentList, setStudentList] = useState(
    students.length > 0
      ? students
      : [
          { id: 1, name: 'Alice Johnson', email: 'alice@school.com', joinDate: '2026-01-15', status: 'active', avatar: 'https://i.pravatar.cc/40?img=1' },
          { id: 2, name: 'Bob Smith', email: 'bob@school.com', joinDate: '2026-01-15', status: 'active', avatar: 'https://i.pravatar.cc/40?img=2' },
          { id: 3, name: 'Carol Davis', email: 'carol@school.com', joinDate: '2026-01-20', status: 'active', avatar: 'https://i.pravatar.cc/40?img=3' },
          { id: 4, name: 'David Wilson', email: 'david@school.com', joinDate: '2026-01-22', status: 'inactive', avatar: 'https://i.pravatar.cc/40?img=4' },
        ]
  );

  const filteredStudents = studentList.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeStudent = (id) => {
    setStudentList(studentList.filter((s) => s.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
              Students ({studentList.length})
            </Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Student
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          className="mb-4"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Student List */}
        <List className="space-y-2">
          {filteredStudents.length === 0 ? (
            <Typography variant="body2" className="text-center text-gray-500 dark:text-gray-400 py-8">
              No students found
            </Typography>
          ) : (
            filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListItem className="bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <ListItemAvatar>
                    <Avatar src={student.avatar} alt={student.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.name}
                    secondary={
                      <Box className="flex gap-2 items-center mt-1">
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                          {student.email}
                        </Typography>
                        <Chip
                          label={student.status}
                          size="small"
                          color={student.status === 'active' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeStudent(student.id)}
                  >
                    Remove
                  </Button>
                </ListItem>
              </motion.div>
            ))
          )}
        </List>
      </Box>
    </motion.div>
  );
};

export default StudentList;
