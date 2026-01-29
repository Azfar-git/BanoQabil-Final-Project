import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Calendar = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateChange(newDate);
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const isSelectedDate = (day) => {
    return selectedDate && 
           day === selectedDate.getDate() &&
           currentMonth.getMonth() === selectedDate.getMonth() &&
           currentMonth.getFullYear() === selectedDate.getFullYear();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box className="p-4">
        {/* Month/Year Header */}
        <Box className="flex justify-between items-center mb-4">
          <IconButton size="small" onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" className="font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Typography>
          <IconButton size="small" onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Day Names */}
        <Box className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <Typography 
              key={day}
              variant="caption" 
              className="text-center font-semibold text-gray-600 dark:text-gray-400"
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Days Grid */}
        <Box className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <Box
              key={index}
              onClick={() => day && handleDateClick(day)}
              className={`
                p-2 text-center rounded cursor-pointer transition-all
                ${day === null ? 'cursor-default' : ''}
                ${isSelectedDate(day)
                  ? 'bg-blue-500 text-white font-bold'
                  : day
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  : ''}
              `}
            >
              {day && (
                <Typography variant="body2" className="font-medium">
                  {day}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default Calendar;
