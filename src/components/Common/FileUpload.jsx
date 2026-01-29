import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  Description as DocIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onFilesUpload, maxFiles = 10, maxSize = 50 * 1024 * 1024 }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <PdfIcon />;
    if (fileType.includes('image')) return <ImageIcon />;
    if (fileType.includes('video')) return <VideoIcon />;
    if (fileType.includes('document') || fileType.includes('text')) return <DocIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  }, []);

  const simulateUpload = (fileId) => {
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
        ));
        setUploading(false);
        if (onFilesUpload) {
          onFilesUpload(files.filter(f => f.status === 'completed'));
        }
      } else {
        setProgress(prev => ({ ...prev, [fileId]: progress }));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }
    }, 200);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'video/*': ['.mp4', '.avi', '.mov'],
    },
  });

  return (
    <Box className="space-y-4">
      {/* Dropzone */}
      <Box
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <UploadIcon className="text-4xl text-gray-400 mb-4 mx-auto" />
        <Typography variant="h6" className="mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" className="text-gray-500 mb-4">
          or click to browse files
        </Typography>
        <Typography variant="caption" className="text-gray-400">
          Max {maxFiles} files • Max {formatFileSize(maxSize)} per file
        </Typography>
        <Box className="flex flex-wrap justify-center gap-2 mt-4">
          <Chip label="PDF" size="small" />
          <Chip label="Images" size="small" />
          <Chip label="Documents" size="small" />
          <Chip label="Videos" size="small" />
        </Box>
      </Box>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Box className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <Typography variant="subtitle1" className="font-semibold mb-3">
                Uploading Files ({files.length})
              </Typography>
              
              <List className="space-y-2">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ListItem 
                      className="bg-white dark:bg-gray-700 rounded-lg"
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === 'uploading'}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        {getFileIcon(file.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box className="flex items-center gap-2">
                            <Typography variant="body2" className="font-medium truncate">
                              {file.name}
                            </Typography>
                            {file.status === 'completed' && (
                              <CheckIcon className="text-green-500" fontSize="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box className="space-y-1">
                            <Typography variant="caption" className="text-gray-500">
                              {formatFileSize(file.size)}
                            </Typography>
                            {file.status === 'uploading' && (
                              <LinearProgress 
                                variant="determinate" 
                                value={file.progress} 
                                className="mt-1"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>

              {uploading && (
                <Box className="mt-4">
                  <Typography variant="caption" className="text-gray-500">
                    Uploading... Please don't close the window
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <Box className="flex justify-end gap-3">
        <Button
          variant="outlined"
          onClick={() => setFiles([])}
          disabled={files.length === 0}
        >
          Clear All
        </Button>
        <Button
          variant="contained"
          disabled={files.length === 0 || uploading}
          onClick={() => onFilesUpload && onFilesUpload(files)}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;
