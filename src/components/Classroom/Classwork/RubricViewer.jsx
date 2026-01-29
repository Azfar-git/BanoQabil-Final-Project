import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const RubricViewer = ({ rubricId, editable = true }) => {
  const [rubric, setRubric] = useState({
    title: 'Web Development Project Rubric',
    totalPoints: 100,
    criteria: [
      {
        id: 1,
        name: 'Code Quality',
        points: 30,
        levels: [
          { level: 'Excellent', points: 30, description: 'Clean, well-organized, follows best practices' },
          { level: 'Good', points: 25, description: 'Generally clean code with minor issues' },
          { level: 'Fair', points: 20, description: 'Code works but needs improvement' },
          { level: 'Poor', points: 10, description: 'Code has significant issues' },
        ],
      },
      {
        id: 2,
        name: 'Functionality',
        points: 40,
        levels: [
          { level: 'Excellent', points: 40, description: 'All features work perfectly' },
          { level: 'Good', points: 35, description: 'Most features work well' },
          { level: 'Fair', points: 25, description: 'Some features missing or buggy' },
          { level: 'Poor', points: 15, description: 'Major functionality missing' },
        ],
      },
      {
        id: 3,
        name: 'Design & UX',
        points: 20,
        levels: [
          { level: 'Excellent', points: 20, description: 'Visually appealing and intuitive' },
          { level: 'Good', points: 15, description: 'Good design with minor issues' },
          { level: 'Fair', points: 10, description: 'Average design' },
          { level: 'Poor', points: 5, description: 'Poor design or usability' },
        ],
      },
      {
        id: 4,
        name: 'Documentation',
        points: 10,
        levels: [
          { level: 'Excellent', points: 10, description: 'Complete and clear documentation' },
          { level: 'Good', points: 8, description: 'Good documentation with minor gaps' },
          { level: 'Fair', points: 5, description: 'Minimal documentation' },
          { level: 'Poor', points: 0, description: 'No documentation' },
        ],
      },
    ],
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);

  const handleEditCriteria = (criteria) => {
    setSelectedCriteria(criteria);
    setOpenDialog(true);
  };

  const handleDeleteCriteria = (id) => {
    setRubric({
      ...rubric,
      criteria: rubric.criteria.filter((c) => c.id !== id),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white mb-2">
            📋 {rubric.title}
          </Typography>
          <Box className="flex gap-4">
            <Box className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <Typography variant="caption" className="text-blue-600 dark:text-blue-300">
                Total Points
              </Typography>
              <Typography variant="h6" className="font-bold text-blue-700 dark:text-blue-200">
                {rubric.totalPoints}
              </Typography>
            </Box>
            <Box className="p-3 bg-green-50 dark:bg-green-900 rounded">
              <Typography variant="caption" className="text-green-600 dark:text-green-300">
                Criteria
              </Typography>
              <Typography variant="h6" className="font-bold text-green-700 dark:text-green-200">
                {rubric.criteria.length}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Rubric Table */}
        <Box className="overflow-x-auto mb-6">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableCell className="font-semibold">Criteria</TableCell>
                <TableCell className="font-semibold">Excellent</TableCell>
                <TableCell className="font-semibold">Good</TableCell>
                <TableCell className="font-semibold">Fair</TableCell>
                <TableCell className="font-semibold">Poor</TableCell>
                {editable && <TableCell className="font-semibold">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rubric.criteria.map((criteria, index) => (
                <motion.tr
                  key={criteria.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  component="tr"
                >
                  <TableCell className="font-semibold">
                    <Box>
                      <Typography variant="body2" className="font-bold text-gray-900 dark:text-white">
                        {criteria.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                        {criteria.points} pts
                      </Typography>
                    </Box>
                  </TableCell>
                  {criteria.levels.map((level) => (
                    <TableCell key={level.level}>
                      <Box className="text-sm">
                        <Typography variant="caption" className="font-semibold text-gray-900 dark:text-white">
                          {level.points} pts
                        </Typography>
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400 block">
                          {level.description}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                  {editable && (
                    <TableCell>
                      <Box className="flex gap-1">
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditCriteria(criteria)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteCriteria(criteria.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Action Buttons */}
        {editable && (
          <Box className="flex gap-2">
            <Button variant="outlined">Add Criteria</Button>
            <Button variant="contained" color="primary">
              Save Rubric
            </Button>
          </Box>
        )}

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Criteria</DialogTitle>
          <DialogContent className="pt-4">
            {selectedCriteria && (
              <TextField
                label="Criteria Name"
                defaultValue={selectedCriteria.name}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default RubricViewer;
