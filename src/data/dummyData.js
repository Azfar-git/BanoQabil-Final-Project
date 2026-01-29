// Dummy data for Google Classroom Clone
export const DUMMY_CLASSES = [
  {
    id: '1',
    name: 'Web Development 101',
    section: 'Period 1',
    subject: 'Computer Science',
    description: 'Learn modern web development with React, Node.js and MongoDB',
    teacher: { id: 't1', name: 'Ahmed Khan', email: 'ahmed@school.com', avatar: '👨‍🏫' },
    students: 32,
    image: 'bg-gradient-to-r from-blue-400 to-blue-600',
    color: '#3b82f6',
    announcements: 5,
    assignments: 12,
    people: 33,
  },
  {
    id: '2',
    name: 'Data Structures',
    section: 'Period 2',
    subject: 'Computer Science',
    description: 'Deep dive into data structures and algorithms',
    teacher: { id: 't2', name: 'Fatima Ahmed', email: 'fatima@school.com', avatar: '👩‍🏫' },
    students: 28,
    image: 'bg-gradient-to-r from-purple-400 to-purple-600',
    color: '#a855f7',
    announcements: 3,
    assignments: 8,
    people: 29,
  },
  {
    id: '3',
    name: 'Digital Marketing',
    section: 'Period 3',
    subject: 'Business',
    description: 'Master the art of digital marketing and social media',
    teacher: { id: 't3', name: 'Hassan Ali', email: 'hassan@school.com', avatar: '👨‍💼' },
    students: 25,
    image: 'bg-gradient-to-r from-green-400 to-green-600',
    color: '#10b981',
    announcements: 7,
    assignments: 6,
    people: 26,
  },
  {
    id: '4',
    name: 'Mobile App Dev',
    section: 'Period 4',
    subject: 'Computer Science',
    description: 'Build native iOS and Android applications',
    teacher: { id: 't4', name: 'Zainab Khan', email: 'zainab@school.com', avatar: '👩‍💻' },
    students: 30,
    image: 'bg-gradient-to-r from-red-400 to-red-600',
    color: '#ef4444',
    announcements: 4,
    assignments: 10,
    people: 31,
  },
];

export const DUMMY_POSTS = [
  {
    id: '1',
    classId: '1',
    author: { id: 't1', name: 'Ahmed Khan', avatar: '👨‍🏫', role: 'teacher' },
    content: 'Welcome to Web Development 101! This class will cover React, Node.js, and modern web practices. Looking forward to an amazing semester!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 15,
    comments: [
      { id: 'c1', author: { name: 'Ali Ahmed', avatar: '👨‍🎓' }, text: 'Super excited for this class!' },
      { id: 'c2', author: { name: 'Sara Khan', avatar: '👩‍🎓' }, text: 'Thanks for posting!' },
    ],
    attachments: [],
  },
  {
    id: '2',
    classId: '1',
    author: { id: 't1', name: 'Ahmed Khan', avatar: '👨‍🏫', role: 'teacher' },
    content: 'Important announcement: Assignment 1 has been updated. Please review the new requirements.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8,
    comments: [],
    attachments: [{ name: 'Assignment_1_Updated.pdf', type: 'pdf' }],
  },
];

export const DUMMY_ASSIGNMENTS = [
  {
    id: '1',
    classId: '1',
    title: 'Build a Todo App with React',
    description: 'Create a fully functional todo application using React with add, edit, delete, and filter features.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    totalPoints: 100,
    status: 'open',
    submissions: 18,
    attachments: [{ name: 'Todo_App_Template.zip', type: 'zip' }],
    rubric: {
      criteria: [
        { name: 'Functionality', points: 40 },
        { name: 'Code Quality', points: 30 },
        { name: 'UI/UX Design', points: 30 },
      ],
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    classId: '1',
    title: 'API Integration Project',
    description: 'Integrate a public API (weather, news, or movies) into a React application.',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    totalPoints: 150,
    status: 'open',
    submissions: 12,
    attachments: [],
    rubric: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    classId: '1',
    title: 'Mid-term Quiz',
    description: 'Quiz covering React fundamentals, hooks, and component lifecycle.',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalPoints: 50,
    status: 'closed',
    submissions: 32,
    attachments: [],
    rubric: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export const DUMMY_SUBMISSIONS = [
  {
    id: '1',
    assignmentId: '1',
    studentId: 's1',
    studentName: 'Ali Ahmed',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    grade: 95,
    feedback: 'Excellent work! Your code is clean and the UI is intuitive.',
    status: 'graded',
    attachments: [{ name: 'todo_app_final.zip', type: 'zip' }],
  },
  {
    id: '2',
    assignmentId: '1',
    studentId: 's2',
    studentName: 'Sara Khan',
    submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    grade: null,
    feedback: '',
    status: 'submitted',
    attachments: [{ name: 'todo_app.zip', type: 'zip' }],
  },
];

export const DUMMY_STUDENTS = [
  { id: 's1', name: 'Ali Ahmed', email: 'ali@student.com', avatar: '👨‍🎓', joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
  { id: 's2', name: 'Sara Khan', email: 'sara@student.com', avatar: '👩‍🎓', joinDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000) },
  { id: 's3', name: 'Hassan Ali', email: 'hassan.s@student.com', avatar: '👨‍🎓', joinDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000) },
  { id: 's4', name: 'Amina Malik', email: 'amina@student.com', avatar: '👩‍🎓', joinDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000) },
];

export const DUMMY_GRADES = [
  { studentId: 's1', studentName: 'Ali Ahmed', assignment: 'Todo App', grade: 95, maxGrade: 100 },
  { studentId: 's1', studentName: 'Ali Ahmed', assignment: 'API Project', grade: 88, maxGrade: 150 },
  { studentId: 's2', studentName: 'Sara Khan', assignment: 'Todo App', grade: 92, maxGrade: 100 },
  { studentId: 's2', studentName: 'Sara Khan', assignment: 'API Project', grade: 85, maxGrade: 150 },
];

export const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    type: 'assignment',
    title: 'New Assignment: Build a Todo App',
    message: 'Ahmed Khan posted a new assignment in Web Development 101',
    classId: '1',
    className: 'Web Development 101',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    type: 'grade',
    title: 'Grade Posted',
    message: 'Ahmed Khan graded your Todo App submission - 95/100',
    classId: '1',
    className: 'Web Development 101',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    type: 'announcement',
    title: 'Class Announcement',
    message: 'Important announcement: Assignment 1 has been updated',
    classId: '1',
    className: 'Web Development 101',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
  },
];

export const DUMMY_TODOS = [
  {
    id: '1',
    title: 'Complete Todo App Assignment',
    description: 'Finish the React todo app project',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    priority: 'high',
    completed: false,
    classId: '1',
    type: 'assignment',
  },
  {
    id: '2',
    title: 'Study React Hooks',
    description: 'Read chapter 5 and practice with examples',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    completed: false,
    type: 'study',
  },
  {
    id: '3',
    title: 'Review API Integration Concepts',
    description: 'Prepare for the API project',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    completed: false,
    classId: '1',
    type: 'study',
  },
];

export const DUMMY_USER = {
  id: 'user123',
  name: 'Muhammad Ali',
  email: 'ali@student.com',
  role: 'student', // 'student' or 'teacher' or 'admin'
  avatar: '👨‍🎓',
  bio: 'Computer Science Student | Web Developer',
  joinDate: new Date(2024, 0, 15),
  phone: '+92-300-1234567',
  location: 'Karachi, Pakistan',
};

export const DUMMY_CALENDAR_EVENTS = [
  {
    id: '1',
    title: 'Assignment Due: Todo App',
    start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    resource: { classId: '1', type: 'assignment' },
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Class Discussion - React Hooks',
    start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    resource: { classId: '1', type: 'event' },
    color: '#10b981',
  },
];
