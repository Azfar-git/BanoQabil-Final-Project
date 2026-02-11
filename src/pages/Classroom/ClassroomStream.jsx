import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { DUMMY_CLASSES, DUMMY_POSTS, DUMMY_USER } from "../../data/dummyData";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";

export default function ClassroomStream() {
  const { id } = useParams();

  // Find specific class data based on URL ID
  const classData = DUMMY_CLASSES.find((c) => c.id === id);

  // Filter posts for this specific class and initialize "liked" state
  const [posts, setPosts] = useState(
    DUMMY_POSTS.filter((p) => p.classId === id).map((p) => ({
      ...p,
      liked: false,
    })),
  );

  const [newPost, setNewPost] = useState("");

  if (!classData) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5">Class not found</Typography>
      </Box>
    );
  }

  const handlePostCreate = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: Date.now().toString(),
      classId: id,
      author: {
        id: DUMMY_USER.id,
        name: DUMMY_USER.name,
        avatar: DUMMY_USER.avatar,
      },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      comments: [],
      attachments: [],
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost("");
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      }),
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-4xl mx-auto">
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            💬 {classData.name} Stream
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 6 }}>
            Share updates and collaborate with your classmates
          </Typography>

          {/* Create Post Section */}
          <Card sx={{ mb: 6, borderRadius: 2 }}>
            <CardContent>
              <form onSubmit={handlePostCreate}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share something with your class..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  variant="outlined"
                />

                <Box
                  sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}
                >
                  <Button variant="outlined" size="small">
                    Add Files
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!newPost.trim()}
                  >
                    Post
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar src={post.author.avatar}>
                        {post.author.name.charAt(0)}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {post.author.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(post.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{ mb: 3, whiteSpace: "pre-wrap" }}
                    >
                      {post.content}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        pt: 1,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          onClick={() => toggleLike(post.id)}
                          size="small"
                        >
                          {post.liked ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {post.likes}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton size="small">
                          <CommentIcon />
                        </IconButton>
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {post.comments?.length || 0}
                        </Typography>
                      </Box>
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
