import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from '../Common/LoadingSkeleton';
// import '../../../styles/index.css';

const ClassGrid = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
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
          color: 'bg-blue-500',
          students: 24,
        },
        {
          id: 2,
          name: 'Data Structures',
          teacher: 'Jane Smith',
          code: 'CS201',
          section: '3rd Period',
          color: 'bg-green-500',
          students: 18,
        },
        {
          id: 3,
          name: 'Advanced Mathematics',
          teacher: 'Robert Johnson',
          code: 'MATH301',
          section: '2nd Period',
          color: 'bg-purple-500',
          students: 22,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          onClick={() => navigate(`/classroom/${classItem.id}`)}
          className={`${classItem.color} rounded-lg shadow-lg p-6 text-white cursor-pointer transform hover:scale-105 transition-transform duration-200`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{classItem.name}</h3>
              <p className="text-sm opacity-90">{classItem.code}</p>
            </div>
          </div>
          <p className="text-sm opacity-85 mb-3">{classItem.teacher}</p>
          <div className="flex justify-between items-center text-xs opacity-75">
            <span>{classItem.section}</span>
            <span>{classItem.students} students</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassGrid;
