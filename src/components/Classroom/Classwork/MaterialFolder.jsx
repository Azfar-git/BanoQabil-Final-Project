import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Folder as FolderIcon, File as FileIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MaterialFolder = ({ folderId, folderName = 'Course Materials' }) => {
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Week 1 Lecture Slides', type: 'folder', items: 5, createdAt: new Date('2026-01-15') },
    { id: 2, name: 'Introduction to HTML', type: 'file', size: '2.4 MB', createdAt: new Date('2026-01-20') },
    { id: 3, name: 'CSS Fundamentals', type: 'file', size: '1.8 MB', createdAt: new Date('2026-01-22') },
    { id: 4, name: 'JavaScript Basics', type: 'file', size: '3.1 MB', createdAt: new Date('2026-01-25') },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials([
        ...materials,
        {
          id: Date.now(),
          name: newMaterial,
          type: 'file',
          size: '0 B',
          createdAt: new Date(),
        },
      ]);
      setNewMaterial('');
      setOpenDialog(false);
    }
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl">
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
              📁 {folderName}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {materials.length} items
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Material
          </Button>
        </Box>

        {/* Materials List */}
        <List className="space-y-2">
          {materials.length === 0 ? (
            <Typography variant="body2" className="text-center text-gray-500 dark:text-gray-400 py-8">
              No materials yet. Add one to get started!
            </Typography>
          ) : (
            materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListItem
                  className="bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  secondaryAction={
                    <Box className="flex gap-1">
                      <Button size="small" startIcon={<EditIcon />}>Edit</Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(material.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {material.type === 'folder' ? (
                      <FolderIcon className="text-blue-500" />
                    ) : (
                      <FileIcon className="text-gray-500" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={material.name}
                    secondary={
                      material.type === 'folder'
                        ? `${material.items} items`
                        : `${material.size} • ${material.createdAt.toLocaleDateString()}`
                    }
                  />
                </ListItem>
              </motion.div>
            ))
          )}
        </List>

        {/* Add Material Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add Course Material</DialogTitle>
          <DialogContent className="pt-4">
            <TextField
              autoFocus
              label="Material Name"
              fullWidth
              variant="outlined"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
              placeholder="e.g., Lecture Notes - Chapter 5"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMaterial} variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default MaterialFolder;
