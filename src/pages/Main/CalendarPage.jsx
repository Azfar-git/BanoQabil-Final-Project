import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { DUMMY_CALENDAR_EVENTS } from '../../data/dummyData';

export default function CalendarPage() {
  const [currentDate] = React.useState(new Date());

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  const firstDay = firstDayOfMonth(currentDate);
  const numDays = daysInMonth(currentDate);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= numDays; i++) days.push(i);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-4xl mx-auto">
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
            📅 Calendar
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-6">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card className="dark:bg-gray-800">
                <CardContent>
                  <Box className="grid grid-cols-7 gap-2">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                      <Typography key={day} className="text-center font-bold text-gray-900 dark:text-white">{day}</Typography>
                    ))}
                    {days.map((day, i) => (
                      <Box
                        key={i}
                        className={`p-2 text-center rounded ${
                          day === currentDate.getDate() ? 'bg-blue-600 text-white font-bold' : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900'
                        }`}
                      >
                        {day}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="dark:bg-gray-800">
                <CardContent>
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">📍 Upcoming Events</Typography>
                  <Box className="space-y-3">
                    {DUMMY_CALENDAR_EVENTS.slice(0,3).map((event,i) => (
                      <Box key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <Typography className="text-gray-900 dark:text-white font-semibold text-sm">{event.title}</Typography>
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
