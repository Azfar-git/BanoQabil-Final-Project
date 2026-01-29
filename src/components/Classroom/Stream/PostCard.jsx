import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import { MoreVert as MoreVertIcon, ThumbUp as ThumbUpIcon, Comment as CommentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const PostCard = ({ post, onDelete, onLike, onComment }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(post.id);
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 bg-white dark:bg-gray-800">
        <CardContent>
          {/* Post Header */}
          <Box className="flex justify-between items-start mb-3">
            <Box className="flex items-center gap-3">
              <Avatar src={post.avatar} alt={post.author} />
              <Box>
                <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white">
                  {post.author}
                </Typography>
                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                  {getTimeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem>Edit</MenuItem>
              <MenuItem onClick={() => onDelete?.(post.id)}>Delete</MenuItem>
              <MenuItem>Report</MenuItem>
            </Menu>
          </Box>

          {/* Post Content */}
          <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {post.content}
          </Typography>

          {/* Attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <Box className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <Typography variant="caption" className="font-semibold">
                Attachments:
              </Typography>
              {post.attachments.map((attachment, index) => (
                <Chip key={index} label={attachment} size="small" className="ml-2" />
              ))}
            </Box>
          )}

          {/* Post Stats */}
          <Box className="flex gap-4 py-2 px-3 border-t dark:border-gray-700 border-b mb-2 text-sm">
            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
              👍 {post.likes + (liked ? 1 : 0)} Likes
            </Typography>
            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
              💬 {post.comments} Comments
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box className="flex gap-2">
            <Button
              fullWidth
              size="small"
              startIcon={<ThumbUpIcon />}
              onClick={handleLike}
              color={liked ? 'primary' : 'inherit'}
            >
              Like
            </Button>
            <Button
              fullWidth
              size="small"
              startIcon={<CommentIcon />}
              onClick={() => onComment?.(post.id)}
            >
              Comment
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
