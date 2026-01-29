import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, List, ListItem, Divider } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const CommentSection = ({ postId, comments = [] }) => {
  const [commentText, setCommentText] = useState('');
  const [allComments, setAllComments] = useState(comments);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        author: 'You',
        avatar: 'https://i.pravatar.cc/40?img=1',
        content: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      setAllComments([...allComments, newComment]);
      setCommentText('');
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Box className="bg-white dark:bg-gray-800 rounded-lg p-4">
      {/* Comment Input */}
      <Box className="mb-6">
        <Box className="flex gap-3">
          <Avatar src="https://i.pravatar.cc/40?img=0" />
          <Box className="flex-1">
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddComment();
                }
              }}
              variant="outlined"
              size="small"
            />
            <Box className="flex justify-end mt-2">
              <Button
                variant="contained"
                color="primary"
                size="small"
                endIcon={<SendIcon />}
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                Comment
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider className="mb-4" />

      {/* Comments List */}
      <Typography variant="subtitle2" className="font-semibold mb-4 text-gray-900 dark:text-white">
        {allComments.length} Comments
      </Typography>

      <List className="space-y-4">
        {allComments.length === 0 ? (
          <Typography variant="body2" className="text-center text-gray-500 dark:text-gray-400 py-4">
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          allComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem className="flex gap-3 p-0 mb-3">
                <Avatar src={comment.avatar} alt={comment.author} />
                <Box className="flex-1">
                  <Box className="flex items-center gap-2">
                    <Typography variant="body2" className="font-semibold text-gray-900 dark:text-white">
                      {comment.author}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                      {getTimeAgo(comment.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mt-1">
                    {comment.content}
                  </Typography>
                  <Box className="flex gap-4 mt-2">
                    <Typography
                      variant="caption"
                      className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                      👍 {comment.likes} Likes
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                      Reply
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            </motion.div>
          ))
        )}
      </List>
    </Box>
  );
};

export default CommentSection;
