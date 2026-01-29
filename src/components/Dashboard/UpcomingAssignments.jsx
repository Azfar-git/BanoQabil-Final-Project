import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from '../Common/LoadingSkeleton';
// import '../../../styles/index.css';

const UpcomingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch upcoming assignments from API
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: 'Web Development Project',
          className: 'Introduction to Web Development',
          dueDate: new Date(Date.now() + 86400000), // 1 day from now
          daysLeft: 1,
          priority: 'high',
          status: 'not_submitted',
        },
        {
          id: 2,
          title: 'Algorithm Assignment',
          className: 'Data Structures',
          dueDate: new Date(Date.now() + 259200000), // 3 days from now
          daysLeft: 3,
          priority: 'high',
          status: 'not_submitted',
        },
        {
          id: 3,
          title: 'Midterm Project',
          className: 'Advanced Mathematics',
          dueDate: new Date(Date.now() + 432000000), // 5 days from now
          daysLeft: 5,
          priority: 'medium',
          status: 'in_progress',
        },
        {
          id: 4,
          title: 'Research Paper',
          className: 'Introduction to Web Development',
          dueDate: new Date(Date.now() + 604800000), // 7 days from now
          daysLeft: 7,
          priority: 'medium',
          status: 'not_submitted',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    if (priority === 'medium') return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
  };

  const getStatusColor = (status) => {
    if (status === 'submitted') return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (status === 'in_progress') return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Assignments</h2>
      <div className="space-y-3">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => navigate(`/assignment/${assignment.id}`)}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assignment.className}</p>
                  <div className="flex gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status === 'not_submitted' && 'Not Submitted'}
                      {assignment.status === 'in_progress' && 'In Progress'}
                      {assignment.status === 'submitted' && 'Submitted'}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-lg ${assignment.daysLeft <= 1 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {assignment.daysLeft}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {assignment.daysLeft === 1 ? 'day left' : 'days left'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {assignment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No upcoming assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAssignments;
