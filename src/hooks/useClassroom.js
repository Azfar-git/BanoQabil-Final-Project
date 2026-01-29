import { useState, useCallback, useEffect } from 'react';

const useClassroom = (classId) => {
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch class data
  const fetchClassData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setClassData({
        id: classId,
        name: 'Sample Class',
        description: 'This is a sample class',
        teacher: { id: 1, name: 'John Doe' },
        students: 30,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments([
        { id: 1, title: 'Assignment 1', dueDate: new Date(), status: 'active' },
        { id: 2, title: 'Assignment 2', dueDate: new Date(), status: 'active' },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents([
        { id: 1, name: 'Student 1', email: 'student1@example.com' },
        { id: 2, name: 'Student 2', email: 'student2@example.com' },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (classId) {
      fetchClassData();
      fetchAssignments();
      fetchStudents();
    }
  }, [classId, fetchClassData, fetchAssignments, fetchStudents]);

  return {
    classData,
    assignments,
    students,
    loading,
    error,
    refetch: () => {
      fetchClassData();
      fetchAssignments();
      fetchStudents();
    },
  };
};

export default useClassroom;
