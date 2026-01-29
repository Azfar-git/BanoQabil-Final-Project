import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { DUMMY_CLASSES, DUMMY_STUDENTS } from '../../data/dummyData';

export default function ClassroomPeople() {
  const { id } = useParams();
  const classData = DUMMY_CLASSES.find(c => c.id === id);
  const [students] = useState(DUMMY_STUDENTS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-4xl mx-auto">
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              👥 Class People
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Teachers and students in this class
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teachers */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  👨‍🏫 Teachers
                </Typography>
                <List className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ListItem className="bg-gray-50 dark:bg-gray-700 rounded">
                      <ListItemAvatar>
                        <Avatar>{classData?.teacher.name.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={classData?.teacher.name}
                        secondary="Teacher"
                      />
                      <Chip label="Teacher" size="small" color="primary" />
                    </ListItem>
                  </motion.div>
                </List>
              </CardContent>
            </Card>

            {/* Students */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    🎓 Students ({students.length})
                  </Typography>
                  <Button size="small" variant="contained">
                    Invite
                  </Button>
                </Box>
                <List className="space-y-2">
                  {students.map((student, i) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ListItem className="bg-gray-50 dark:bg-gray-700 rounded">
                        <ListItemAvatar>
                          <Avatar>{student.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={student.name}
                          secondary={student.email}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
