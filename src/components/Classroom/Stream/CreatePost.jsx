import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Typography, IconButton, InputAdornment } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon, EmojiEmotions as EmojiIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const CreatePost = ({ classId, onPostCreate }) => {
  const [postContent, setPostContent] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handlePost = () => {
    if (postContent.trim() || attachments.length > 0) {
      const newPost = {
        id: Date.now(),
        author: 'You',
        avatar: 'https://i.pravatar.cc/40?img=0',
        content: postContent,
        attachments: attachments,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
      };
      onPostCreate?.(newPost);
      setPostContent('');
      setAttachments([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        {/* Header */}
        <Box className="flex items-center gap-3 mb-4">
          <Avatar src="https://i.pravatar.cc/40?img=0" />
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            What's on your mind?
          </Typography>
        </Box>

        {/* Content Input */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Share an update, assignment, or announcement with your class..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          variant="outlined"
          className="mb-4"
        />

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <Box className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <Typography variant="caption" className="font-semibold text-gray-700 dark:text-gray-300">
              Attachments ({attachments.length})
            </Typography>
            <Box className="flex flex-wrap gap-2 mt-2">
              {attachments.map((file, index) => (
                <Box key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                  {file}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Action Bar */}
        <Box className="flex justify-between items-center">
          <Box className="flex gap-2">
            <IconButton size="small" title="Attach File">
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" title="Add Emoji">
              <EmojiIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box className="flex gap-2">
            <Button variant="outlined" onClick={() => setPostContent('')}>
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handlePost}
              disabled={!postContent.trim() && attachments.length === 0}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default CreatePost;
