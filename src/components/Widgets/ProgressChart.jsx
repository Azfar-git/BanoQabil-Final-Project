import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Helper to convert grade strings to numbers (if needed)
const gradeToNumber = (grade) => {
  if (typeof grade === 'number') return grade;
  if (typeof grade === 'string') {
    // Handle common grade formats: "A", "B+", "85%", "85/100", etc.
    if (grade.includes('%')) return parseFloat(grade) || 0;
    if (grade.includes('/')) {
      const [num, den] = grade.split('/').map(Number);
      return den ? (num / den) * 100 : 0;
    }
    // Letter grades
    const letterMap = { 'A+': 98, 'A': 95, 'A-': 92, 'B+': 88, 'B': 85, 'B-': 82, 'C+': 78, 'C': 75, 'C-': 72, 'D': 65, 'F': 50 };
    return letterMap[grade.toUpperCase()] || 0;
  }
  return 0;
};

const ProgressChart = ({ darkMode }) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState('0');

  useEffect(() => {
    if (!user?.id) return;

    const fetchProgress = async () => {
      try {
        // 1. Get all classes user is enrolled in
        const classesSnapshot = await getDocs(collection(db, "classes"));
        const userClasses = [];
        classesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.teacherId === user.id || data.students?.some(s => s.id === user.id)) {
            userClasses.push({ id: doc.id, ...data });
          }
        });

        // 2. Collect all graded submissions for the user
        const submissionsByMonth = {};

        for (const cls of userClasses) {
          const postsSnapshot = await getDocs(collection(db, "classes", cls.id, "posts"));
          postsSnapshot.forEach((postDoc) => {
            const post = postDoc.data();
            if (!post.submissions) return;

            post.submissions.forEach((sub) => {
              if (sub.studentId === user.id && sub.grade && sub.submittedAt) {
                const date = new Date(sub.submittedAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleString('default', { month: 'short' });

                if (!submissionsByMonth[monthKey]) {
                  submissionsByMonth[monthKey] = { total: 0, count: 0, name: monthName };
                }
                submissionsByMonth[monthKey].total += gradeToNumber(sub.grade);
                submissionsByMonth[monthKey].count += 1;
              }
            });
          });
        }

        // 3. Convert to array and calculate averages
        const months = Object.keys(submissionsByMonth).sort();
        const data = months.map(key => ({
          month: submissionsByMonth[key].name,
          progress: Math.round(submissionsByMonth[key].total / submissionsByMonth[key].count),
        }));

        setChartData(data);

        // 4. Calculate overall average
        if (data.length > 0) {
          const avg = data.reduce((sum, item) => sum + item.progress, 0) / data.length;
          setOverallProgress(Math.round(avg));
        }

        // 5. Calculate change from first to last month
        if (data.length >= 2) {
          const first = data[0].progress;
          const last = data[data.length - 1].progress;
          const change = ((last - first) / first * 100).toFixed(1);
          setMonthlyChange(change);
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgress();
  }, [user]);

  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    muted: darkMode ? 'text-gray-400' : 'text-gray-600',
    chartGrid: darkMode ? '#374151' : '#e5e7eb',
    chartAxis: darkMode ? '#9ca3af' : '#6b7280',
    tooltip: darkMode ? '#1f2937' : '#ffffff',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className={`${theme.bg} rounded-lg shadow-md p-6`}>
        <Typography variant="h6" className={`font-semibold mb-4 ${theme.text}`}>
          Student Progress Overview
        </Typography>
        
        <Box className="mb-6">
          <Box className="flex justify-between items-center mb-2">
            <Typography variant="body2" className={theme.muted}>
              Overall Class Progress
            </Typography>
            <Typography variant="body2" className={`font-semibold ${theme.text}`}>
              {overallProgress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={overallProgress} 
            className="h-2"
            sx={{ 
              backgroundColor: darkMode ? '#374151' : '#e5e7eb',
              '& .MuiLinearProgress-bar': { backgroundColor: '#3b82f6' }
            }}
          />
        </Box>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="month" stroke={theme.chartAxis} />
              <YAxis stroke={theme.chartAxis} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.tooltip, 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  color: darkMode ? '#fff' : '#000'
                }} 
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box className="h-[250px] flex items-center justify-center">
            <Typography className={theme.muted}>No progress data available</Typography>
          </Box>
        )}

        <Box className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-sm">
          <Typography variant="caption" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            📊 Average improvement: {monthlyChange}% this period
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProgressChart;