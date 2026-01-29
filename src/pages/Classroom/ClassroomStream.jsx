import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, TextField, Avatar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { DUMMY_CLASSES, DUMMY_POSTS } from '../../data/dummyData';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

export default function ClassroomStream() {
  const { id } = useParams();
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [newPost, setNewPost] = useState('');
  const classData = DUMMY_CLASSES.find(c => c.id === id);

  if (!classData) return <Box className="p-8 text-center">Class not found</Box>;

  const handlePostCreate = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      authorId: '1',
      author: 'You',
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-4xl mx-auto">
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            💬 {classData.name} Stream
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-6">
            Share updates and collaborate with your classmates
          </Typography>

          {/* Create Post */}
          <Card className="dark:bg-gray-800 mb-6">
            <CardContent>
              <form onSubmit={handlePostCreate}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share something with your class..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="dark:text-white"
                />
                <Box className="flex justify-end gap-2 mt-4">
                  <Button variant="outlined">Add Files</Button>
                  <Button variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold" type="submit">
                    Post
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>

          {/* Posts */}
          <Box className="space-y-4">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="dark:bg-gray-800">
                  <CardContent>
                    <Box className="flex gap-3 mb-4">
                      <Avatar>{post.author.charAt(0)}</Avatar>
                      <Box className="flex-1">
                        <Typography className="font-semibold text-gray-900 dark:text-white">{post.author}</Typography>
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                          {post.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography className="text-gray-900 dark:text-white mb-4">{post.content}</Typography>
                    <Box className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <IconButton
                        size="small"
                        onClick={() => toggleLike(post.id)}
                        className={post.liked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}
                      >
                        {post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        <Typography variant="caption" className="ml-1">{post.likes}</Typography>
                      </IconButton>
                      <IconButton size="small" className="text-gray-600 dark:text-gray-400">
                        <CommentIcon />
                        <Typography variant="caption" className="ml-1">{post.comments.length}</Typography>
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
