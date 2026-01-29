import React, { useState } from 'react';
import { Box, Typography, Image } from '@mui/material';
import { motion } from 'framer-motion';
import { Close as CloseIcon } from '@mui/icons-material';

const AttachmentPreview = ({ attachment, onClose }) => {
  const [loading, setLoading] = useState(true);

  if (!attachment) return null;

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📎';
  };

  const isImage = attachment.type?.includes('image');
  const isPdf = attachment.type?.includes('pdf');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <Box
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
              {attachment.name}
            </Typography>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <CloseIcon />
            </button>
          </Box>

          {/* Content */}
          <Box className="p-4">
            {isImage ? (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-w-full max-h-96 rounded"
                onLoad={() => setLoading(false)}
              />
            ) : isPdf ? (
              <Box className="text-center py-8">
                <Typography variant="h4" className="mb-4">📄</Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  PDF file: {attachment.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500 dark:text-gray-500 block mt-2">
                  Size: {(attachment.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            ) : (
              <Box className="text-center py-8">
                <Typography variant="h4" className="mb-4">
                  {getFileIcon(attachment.type)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  {attachment.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500 dark:text-gray-500 block mt-2">
                  Size: {(attachment.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
              Uploaded on {new Date(attachment.uploadDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AttachmentPreview;
