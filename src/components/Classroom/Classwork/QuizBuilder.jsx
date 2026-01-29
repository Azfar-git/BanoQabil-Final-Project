import React, { useState } from 'react';
import { Box, Typography, Button, TextField, FormControlLabel, Checkbox, RadioGroup, Radio, List, ListItem, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Drag as DragIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const QuizBuilder = ({ quizId = 'new' }) => {
  const [quizTitle, setQuizTitle] = useState('Quiz 1');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 1,
      points: 1,
    },
    {
      id: 2,
      type: 'true-false',
      question: 'JavaScript is a compiled language.',
      correctAnswer: false,
      points: 1,
    },
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState('multiple-choice');

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([
        ...questions,
        {
          id: Date.now(),
          type: questionType,
          question: newQuestion,
          options: questionType === 'multiple-choice' ? ['', '', '', ''] : [],
          correctAnswer: 0,
          points: 1,
        },
      ]);
      setNewQuestion('');
    }
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl">
        {/* Quiz Info */}
        <Box className="mb-6">
          <TextField
            label="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            fullWidth
            variant="outlined"
            className="mb-4"
          />
          <Box className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
            <Typography variant="body2" className="text-blue-600 dark:text-blue-300">
              📊 Total Points: {totalPoints} | Questions: {questions.length}
            </Typography>
          </Box>
        </Box>

        {/* Questions List */}
        <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
          Questions
        </Typography>

        <List className="space-y-4 mb-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Box className="p-4 bg-gray-50 dark:bg-gray-700 rounded border-l-4 border-blue-500">
                <Box className="flex justify-between items-start mb-2">
                  <Box className="flex items-center gap-2 flex-1">
                    <DragIcon className="text-gray-400 cursor-move" />
                    <Typography variant="body2" className="font-semibold text-gray-900 dark:text-white">
                      Q{index + 1}: {question.question}
                    </Typography>
                  </Box>
                  <Box className="flex gap-2">
                    <Typography variant="caption" className="px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded">
                      {question.points}pt
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {question.type === 'multiple-choice' && (
                  <Box className="ml-8 space-y-1">
                    {question.options.map((option, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        control={<Radio checked={question.correctAnswer === optIndex} />}
                        label={option || `Option ${optIndex + 1}`}
                      />
                    ))}
                  </Box>
                )}

                {question.type === 'true-false' && (
                  <Box className="ml-8 space-y-1">
                    <FormControlLabel
                      control={<Radio checked={question.correctAnswer === true} />}
                      label="True"
                    />
                    <FormControlLabel
                      control={<Radio checked={question.correctAnswer === false} />}
                      label="False"
                    />
                  </Box>
                )}
              </Box>
            </motion.div>
          ))}
        </List>

        {/* Add Question */}
        <Box className="border-t dark:border-gray-700 pt-6">
          <Typography variant="subtitle2" className="font-semibold mb-3 text-gray-900 dark:text-white">
            Add New Question
          </Typography>
          <Box className="space-y-3">
            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter your question here..."
            />
            <Box>
              <Typography variant="caption" className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                Question Type
              </Typography>
              <RadioGroup
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                row
              >
                <FormControlLabel value="multiple-choice" control={<Radio />} label="Multiple Choice" />
                <FormControlLabel value="true-false" control={<Radio />} label="True/False" />
              </RadioGroup>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              disabled={!newQuestion.trim()}
            >
              Add Question
            </Button>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="mt-6 flex gap-2 justify-end">
          <Button variant="outlined">Save as Draft</Button>
          <Button variant="contained" color="primary">
            Publish Quiz
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default QuizBuilder;
