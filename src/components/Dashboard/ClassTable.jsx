import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from '../Common/LoadingSkeleton';
// import '../../../styles/index.css';

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch classes from API
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: 'Introduction to Web Development',
          teacher: 'John Doe',
          code: 'WEB101',
          section: '5th Period',
          students: 24,
          assignments: 5,
          ungraded: 2,
        },
        {
          id: 2,
          name: 'Data Structures',
          teacher: 'Jane Smith',
          code: 'CS201',
          section: '3rd Period',
          students: 18,
          assignments: 3,
          ungraded: 1,
        },
        {
          id: 3,
          name: 'Advanced Mathematics',
          teacher: 'Robert Johnson',
          code: 'MATH301',
          section: '2nd Period',
          students: 22,
          assignments: 8,
          ungraded: 3,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const sortedClasses = [...classes].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'students') return b.students - a.students;
    if (sortBy === 'ungraded') return b.ungraded - a.ungraded;
    return 0;
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Classes</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="students">Sort by Students</option>
            <option value="ungraded">Sort by Ungraded</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Class Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Teacher</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Students</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Assignments</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ungraded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedClasses.map((classItem) => (
              <tr
                key={classItem.id}
                onClick={() => navigate(`/classroom/${classItem.id}`)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{classItem.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{classItem.code}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{classItem.teacher}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{classItem.students}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{classItem.assignments}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={classItem.ungraded > 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                    {classItem.ungraded}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassTable;
