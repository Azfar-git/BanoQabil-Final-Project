import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const TeacherList = ({ classId, teachers = [] }) => {
  const [teacherList, setTeacherList] = useState(
    teachers.length > 0
      ? teachers
      : [
          { id: 1, name: 'John Doe', email: 'john@school.com', role: 'Teacher', avatar: 'https://i.pravatar.cc/40?img=10', joinDate: '2026-01-01' },
          { id: 2, name: 'Jane Smith', email: 'jane@school.com', role: 'Co-teacher', avatar: 'https://i.pravatar.cc/40?img=11', joinDate: '2026-01-05' },
        ]
  );

  const removeTeacher = (id) => {
    if (teacherList.length > 1) {
      setTeacherList(teacherList.filter((t) => t.id !== id));
    }
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
              Teachers & Co-teachers ({teacherList.length})
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              Only the owner can delete the primary teacher
            </Typography>
          </Box>
          <Button variant="contained" color="primary">
            Add Co-teacher
          </Button>
        </Box>

        {/* Teacher List */}
        <List className="space-y-2">
          {teacherList.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem className="bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <ListItemAvatar>
                  <Avatar src={teacher.avatar} alt={teacher.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={teacher.name}
                  secondary={
                    <Box className="flex gap-2 items-center mt-1">
                      <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                        {teacher.email}
                      </Typography>
                      <Chip label={teacher.role} size="small" color="primary" variant="outlined" />
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-500">
                        Joined {new Date(teacher.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                {teacherList.length > 1 && (
                  <Box className="flex gap-1">
                    <Button size="small" startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeTeacher(teacher.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>
    </motion.div>
  );
};

export default TeacherList;
