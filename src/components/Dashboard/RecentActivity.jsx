import React, { useState, useEffect } from 'react';
import LoadingSkeleton from '../Common/LoadingSkeleton';
// import '../../../styles/index.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent activities from API
    setTimeout(() => {
      setActivities([
        {
          id: 1,
          type: 'assignment_submitted',
          title: 'Assignment Submitted',
          description: 'John Smith submitted "Web Development Project"',
          className: 'Introduction to Web Development',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          icon: '📝',
          color: 'bg-blue-100 dark:bg-blue-900',
        },
        {
          id: 2,
          type: 'grade_posted',
          title: 'Grade Posted',
          description: 'Grades for "Quiz 3" have been posted',
          className: 'Advanced Mathematics',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          icon: '📊',
          color: 'bg-green-100 dark:bg-green-900',
        },
        {
          id: 3,
          type: 'announcement',
          title: 'New Announcement',
          description: 'Exam date has been scheduled',
          className: 'Data Structures',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          icon: '📢',
          color: 'bg-yellow-100 dark:bg-yellow-900',
        },
        {
          id: 4,
          type: 'comment',
          title: 'New Comment',
          description: 'Teacher replied to your assignment',
          className: 'Introduction to Web Development',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          icon: '💬',
          color: 'bg-purple-100 dark:bg-purple-900',
        },
        {
          id: 5,
          type: 'due_soon',
          title: 'Due Soon',
          description: '"Midterm Project" is due in 2 days',
          className: 'Advanced Mathematics',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          icon: '⏰',
          color: 'bg-red-100 dark:bg-red-900',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return '1 day ago';
    return `${days}d ago`;
  };

  if (loading) {
    return <LoadingSkeleton count={5} />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`${activity.color} rounded-lg p-4 flex items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity`}
          >
            <div className="text-2xl flex-shrink-0">{activity.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{activity.description}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">{activity.className}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
