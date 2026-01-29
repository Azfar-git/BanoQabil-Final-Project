import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Checkbox 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckIcon, Circle as UncheckIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ToDoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Review student submissions', completed: false, date: '2026-01-28' },
    { id: 2, title: 'Create assignment for next week', completed: true, date: '2026-01-27' },
    { id: 3, title: 'Grade midterm exams', completed: false, date: '2026-01-30' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title: inputValue,
          completed: false,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setInputValue('');
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
            To-Do List
          </Typography>
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            {completedCount} of {totalCount} completed
          </Typography>
        </Box>

        {/* Progress bar */}
        <Box className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <Box
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </Box>

        {/* Input */}
        <Box className="flex gap-2 mb-4">
          <TextField
            size="small"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            fullWidth
            variant="outlined"
            className="dark:bg-gray-700"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddTodo}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>

        {/* Todo List */}
        <List className="max-h-80 overflow-y-auto">
          {todos.length === 0 ? (
            <Typography variant="body2" className="text-center text-gray-500 dark:text-gray-400 py-4">
              No tasks yet. Add one to get started!
            </Typography>
          ) : (
            todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListItem
                  className={`rounded mb-2 ${
                    todo.completed
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteTodo(todo.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      icon={<UncheckIcon />}
                      checkedIcon={<CheckIcon />}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        className={todo.completed ? 'line-through text-gray-500' : ''}
                      >
                        {todo.title}
                      </Typography>
                    }
                    secondary={new Date(todo.date).toLocaleDateString()}
                  />
                </ListItem>
              </motion.div>
            ))
          )}
        </List>
      </Box>
    </motion.div>
  );
};

export default ToDoList;
