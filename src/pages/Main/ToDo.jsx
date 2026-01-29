import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Checkbox,
} from '@mui/material';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// ✅ SAFE DUMMY DATA (Date string, NOT Date object)
const DUMMY_TODOS = [
  {
    id: 1,
    title: 'Complete React assignment',
    completed: false,
    dueDate: '2026-01-30',
  },
  {
    id: 2,
    title: 'Prepare presentation',
    completed: true,
    dueDate: '2026-01-28',
  },
];

// ✅ Date formatter (VERY IMPORTANT)
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export default function ToDoPage() {
  const [todos, setTodos] = useState(DUMMY_TODOS);
  const [newTodo, setNewTodo] = useState('');

  const toggleComplete = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: newTodo,
        completed: false,
        dueDate: new Date().toISOString(), // ✅ string
      },
    ]);

    setNewTodo('');
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <Box className="max-w-2xl mx-auto">
          {/* Header */}
          <Typography
            variant="h4"
            className="font-bold text-gray-900 dark:text-white mb-2"
          >
            ✓ My To-Do List
          </Typography>

          <Typography
            variant="body2"
            className="text-gray-600 dark:text-gray-400 mb-4"
          >
            {completedCount} of {todos.length} tasks completed
          </Typography>

          {/* Add Todo */}
          <Card className="dark:bg-gray-800 mb-4">
            <CardContent>
              <form onSubmit={addTodo} className="flex gap-2">
                <TextField
                  fullWidth
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  size="small"
                />
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Todo List */}
          <Box className="space-y-2">
            {todos.map((todo, i) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="dark:bg-gray-800">
                  <CardContent className="flex gap-3 items-center">
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                    />

                    <Box className="flex-1">
                      <Typography
                        className={`text-gray-900 dark:text-white ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : ''
                        }`}
                      >
                        {todo.title}
                      </Typography>

                      {/* ✅ DATE SAFE RENDER */}
                      <Typography
                        variant="caption"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        Due: {formatDate(todo.dueDate)}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
