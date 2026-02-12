import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  CheckCircle2,
  ListTodo,
  Calendar as CalendarIcon,
} from "lucide-react";

const DUMMY_TODOS = [
  {
    id: 1,
    title: "Complete React assignment",
    completed: false,
    dueDate: "2026-02-15",
  },
  {
    id: 2,
    title: "Prepare presentation",
    completed: true,
    dueDate: "2026-02-12",
  },
];

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function ToDoPage() {
  const [todos, setTodos] = useState(DUMMY_TODOS);
  const [newTodo, setNewTodo] = useState("");

  const toggleComplete = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    // ✅ Prepends the new task to the top of the list
    setTodos([
      {
        id: Date.now(),
        title: newTodo,
        completed: false,
        dueDate: new Date().toISOString(),
      },
      ...todos,
    ]);
    setNewTodo("");
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercentage =
    todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-[#f8fafc] p-6">
        <Box className="max-w-2xl mx-auto">
          {/* Header & Stats */}
          <Box className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={20} className="text-[#2563eb]" />
              <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-[0.2em]">
                Task Management
              </span>
            </div>
            <Typography
              variant="h4"
              className="font-extrabold text-[#1e293b] tracking-tight mb-4"
            >
              To-Do List
            </Typography>

            <Box className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <Typography className="text-sm font-bold text-[#64748b]">
                  {completedCount} of {todos.length} Tasks Completed
                </Typography>
                <Typography className="text-sm font-black text-[#2563eb]">
                  {Math.round(progressPercentage)}%
                </Typography>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-[#2563eb]"
                />
              </div>
            </Box>
          </Box>

          {/* Add Todo Input */}
          <Card className="rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
            <CardContent className="p-4 bg-white">
              <form onSubmit={addTodo} className="flex gap-3">
                <TextField
                  fullWidth
                  placeholder="Add a priority task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f1f5f9",
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  disableElevation
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl px-6 capitalize font-bold transition-transform active:scale-95"
                >
                  <Plus size={20} />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Todo List Items */}
          <Box className="space-y-3">
            <AnimatePresence initial={false}>
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <Card
                    className={`rounded-xl border transition-all duration-200 group ${
                      todo.completed
                        ? "bg-slate-50/50 border-slate-100"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <CardContent className="flex gap-4 items-center p-4 !pb-4">
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        sx={{
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: "#2563eb" },
                        }}
                      />

                      <Box className="flex-1">
                        <Typography
                          className={`font-bold transition-all ${
                            todo.completed
                              ? "line-through text-[#94a3b8]"
                              : "text-[#1e293b]"
                          }`}
                        >
                          {todo.title}
                        </Typography>

                        <div className="flex items-center gap-1.5 mt-1 text-[#64748b]">
                          <CalendarIcon size={12} />
                          <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Due {formatDate(todo.dueDate)}
                          </span>
                        </div>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {todos.length === 0 && (
              <Box className="text-center py-12">
                <ListTodo size={48} className="mx-auto text-slate-200 mb-4" />
                <Typography className="text-slate-400 font-medium">
                  Your list is clear!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
