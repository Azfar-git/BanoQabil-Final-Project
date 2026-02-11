export const mockUser = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@student.edu',
  role: 'student', // student, teacher, admin
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Passionate about computer science and mathematics',
  phone: '+1 (555) 123-4567',
  joinDate: '2023-09-01',
  status: 'active',
  notifications: {
    email: true,
    push: true,
    assignmentReminders: true,
    announcementAlerts: true,
    gradePostings: true,
  },
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    weekStart: 'monday',
  }
};

export const mockTeachers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@university.edu',
    role: 'teacher',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Mathematics',
    officeHours: 'Mon/Wed 2-4 PM',
    phone: '+1 (555) 234-5678',
    courses: ['Mathematics 101', 'Calculus II'],
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    email: 'michael.c@university.edu',
    role: 'teacher',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Computer Science',
    officeHours: 'Tue/Thu 10-12 PM',
    phone: '+1 (555) 345-6789',
    courses: ['Computer Science', 'Data Structures'],
  },
];

export const mockStudents = [
  {
    id: 101,
    name: 'Emma Watson',
    email: 'emma.w@student.edu',
    avatar: 'https://i.pravatar.cc/150?img=12',
    status: 'active',
    lastActive: '2024-01-18T14:30:00',
    assignmentsSubmitted: 24,
    averageGrade: 92.5,
    attendance: 95.2,
  },
  {
    id: 102,
    name: 'James Smith',
    email: 'james.s@student.edu',
    avatar: 'https://i.pravatar.cc/150?img=15',
    status: 'active',
    lastActive: '2024-01-18T10:15:00',
    assignmentsSubmitted: 22,
    averageGrade: 87.3,
    attendance: 88.7,
  },
  // ... 30 more students
];

export const mockClasses = [
  {
    id: 1,
    name: 'Mathematics 101',
    code: 'MAT101',
    teacher: 'Dr. Sarah Johnson',
    teacherId: 1,
    subject: 'Mathematics',
    description: 'Introduction to fundamental mathematical concepts including algebra, geometry, and basic calculus.',
    color: 'bg-classroom-blue',
    icon: 'calculate',
    students: 32,
    assignments: 12,
    announcements: 8,
    materials: 15,
    schedule: {
      days: ['Monday', 'Wednesday'],
      time: '10:00 AM - 11:30 AM',
      room: 'Building A, Room 301',
    },
    status: 'active',
    createdDate: '2023-09-01',
    settings: {
      allowStudentPosts: true,
      allowStudentComments: true,
      showDeletedItems: false,
      gradingScale: 'percentage',
    },
  },
  {
    id: 2,
    name: 'Advanced Computer Science',
    code: 'CS401',
    teacher: 'Prof. Michael Chen',
    teacherId: 2,
    subject: 'Computer Science',
    description: 'Advanced topics in computer science including algorithms, data structures, and system design.',
    color: 'bg-classroom-green',
    icon: 'code',
    students: 28,
    assignments: 15,
    announcements: 6,
    materials: 22,
    schedule: {
      days: ['Tuesday', 'Thursday'],
      time: '2:00 PM - 3:30 PM',
      room: 'Tech Building, Lab 205',
    },
    status: 'active',
    createdDate: '2023-09-05',
    settings: {
      allowStudentPosts: false,
      allowStudentComments: true,
      showDeletedItems: true,
      gradingScale: 'points',
    },
  },
  // ... 10 more classes
];

export const mockAssignments = [
  {
    id: 1,
    classId: 1,
    title: 'Linear Algebra Homework #3',
    description: 'Complete exercises 1-15 from Chapter 4. Show all your work and submit as PDF.',
    instructions: `
      <h3>Instructions:</h3>
      <ul>
        <li>Solve all problems showing complete work</li>
        <li>Submit as a single PDF file</li>
        <li>Include your name and student ID</li>
        <li>No late submissions accepted</li>
      </ul>
    `,
    type: 'homework',
    points: 100,
    weight: 15,
    dueDate: '2024-01-25T23:59:00',
    submissionTypes: ['pdf', 'doc', 'image'],
    attachments: [
      { name: 'Chapter4_Exercises.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Sample_Solution.docx', size: '1.8 MB', type: 'doc' },
    ],
    rubric: {
      criteria: [
        { name: 'Completeness', weight: 40, maxPoints: 40 },
        { name: 'Accuracy', weight: 40, maxPoints: 40 },
        { name: 'Presentation', weight: 20, maxPoints: 20 },
      ],
    },
    status: 'published',
    createdDate: '2024-01-10',
    submissions: 28,
    graded: 15,
    averageScore: 85.3,
  },
  {
    id: 2,
    classId: 2,
    title: 'React Final Project',
    description: 'Build a complete React application with at least 5 components and state management.',
    instructions: `
      <h3>Project Requirements:</h3>
      <ol>
        <li>Use React functional components</li>
        <li>Implement at least 5 reusable components</li>
        <li>Use Context API or Redux for state management</li>
        <li>Include proper error handling</li>
        <li>Deploy to Vercel/Netlify</li>
      </ol>
    `,
    type: 'project',
    points: 200,
    weight: 30,
    dueDate: '2024-02-15T23:59:00',
    submissionTypes: ['github', 'zip', 'url'],
    attachments: [
      { name: 'Project_Guidelines.pdf', size: '3.2 MB', type: 'pdf' },
      { name: 'Rubric.xlsx', size: '0.5 MB', type: 'excel' },
    ],
    rubric: {
      criteria: [
        { name: 'Functionality', weight: 40, maxPoints: 80 },
        { name: 'Code Quality', weight: 30, maxPoints: 60 },
        { name: 'UI/UX Design', weight: 20, maxPoints: 40 },
        { name: 'Documentation', weight: 10, maxPoints: 20 },
      ],
    },
    status: 'published',
    createdDate: '2024-01-12',
    submissions: 10,
    graded: 0,
    averageScore: null,
  },
  // ... 50 more assignments
];

export const mockSubmissions = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 101,
    studentName: 'Emma Watson',
    submittedAt: '2024-01-24T14:30:00',
    status: 'submitted',
    grade: 92,
    maxGrade: 100,
    feedback: 'Excellent work! Your solutions are clear and well-documented.',
    attachments: [
      { name: 'hw3_emma.pdf', size: '1.2 MB', type: 'pdf' },
    ],
    late: false,
    turnedIn: true,
    comments: [
      {
        id: 1,
        author: 'Dr. Sarah Johnson',
        content: 'Great job on problem 7!',
        timestamp: '2024-01-25T10:15:00',
      },
    ],
  },
  // ... 100 more submissions
];

export const mockAnnouncements = [
  {
    id: 1,
    classId: 1,
    title: 'Midterm Exam Schedule Update',
    content: `
      <p>The midterm exam has been rescheduled to <strong>February 15th, 2024</strong> from 10:00 AM to 12:00 PM.</p>
      <p>Location: <em>Main Hall, Room 301</em></p>
      <p>Please bring your student ID and a calculator. The exam will cover chapters 1-6.</p>
      <p>Good luck with your preparation!</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorId: 1,
    attachments: [
      { name: 'Midterm_Syllabus.pdf', size: '1.5 MB', type: 'pdf' },
    ],
    pinned: true,
    allowComments: true,
    comments: [
      {
        id: 1,
        author: 'Emma Watson',
        content: 'Will there be a review session?',
        timestamp: '2024-01-15T11:30:00',
        replies: [
          {
            id: 2,
            author: 'Dr. Sarah Johnson',
            content: 'Yes, review session on February 13th at 5 PM.',
            timestamp: '2024-01-15T14:00:00',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T09:00:00',
    updatedAt: '2024-01-15T09:00:00',
  },
  // ... 30 more announcements
];

export const mockMaterials = [
  {
    id: 1,
    classId: 1,
    name: 'Calculus Textbook',
    type: 'pdf',
    size: '45.2 MB',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadedAt: '2023-09-10T14:30:00',
    downloadCount: 128,
    folder: 'Textbooks',
    tags: ['textbook', 'calculus', 'required'],
    previewUrl: 'https://example.com/preview.pdf',
  },
  {
    id: 2,
    classId: 2,
    name: 'React Tutorial Series',
    type: 'video',
    size: '450 MB',
    uploadedBy: 'Prof. Michael Chen',
    uploadedAt: '2023-09-12T10:15:00',
    downloadCount: 89,
    folder: 'Tutorials',
    tags: ['react', 'tutorial', 'video'],
    duration: '45:30',
  },
  // ... 50 more materials
];

export const mockGrades = [
  {
    studentId: 101,
    studentName: 'Emma Watson',
    classId: 1,
    assignments: [
      { assignmentId: 1, title: 'Homework 1', score: 95, maxScore: 100, weight: 10 },
      { assignmentId: 2, title: 'Quiz 1', score: 88, maxScore: 100, weight: 15 },
    ],
    totalScore: 456,
    maxTotalScore: 500,
    percentage: 91.2,
    letterGrade: 'A-',
    rank: 3,
    feedback: 'Excellent performance. Keep up the good work!',
  },
  // ... 100 more grade entries
];

export const mockCalendarEvents = [
  {
    id: 1,
    title: 'Math Midterm',
    classId: 1,
    className: 'Mathematics 101',
    start: '2024-02-15T10:00:00',
    end: '2024-02-15T12:00:00',
    type: 'exam',
    color: '#ef4444',
    location: 'Main Hall, Room 301',
    description: 'Midterm exam covering chapters 1-6',
  },
  {
    id: 2,
    title: 'Project Submission',
    classId: 2,
    className: 'Advanced CS',
    start: '2024-02-15T23:59:00',
    end: '2024-02-15T23:59:00',
    type: 'deadline',
    color: '#3b82f6',
    description: 'React Final Project due',
  },
  // ... 50 more events
];

export const mockToDoItems = [
  {
    id: 1,
    title: 'Complete Linear Algebra Homework',
    description: 'Chapter 4 exercises 1-15',
    dueDate: '2024-01-25T23:59:00',
    classId: 1,
    className: 'Mathematics 101',
    priority: 'high',
    completed: false,
    createdAt: '2024-01-18T09:00:00',
  },
  // ... 20 more todo items
];

export const mockNotifications = [
  {
    id: 1,
    type: 'assignment',
    title: 'New Assignment Posted',
    message: 'Linear Algebra Homework #3 has been posted',
    classId: 1,
    assignmentId: 1,
    read: false,
    timestamp: '2024-01-18T14:30:00',
  },
  {
    id: 2,
    type: 'grade',
    title: 'Grade Posted',
    message: 'Your grade for Quiz 1 has been posted: 95/100',
    classId: 1,
    assignmentId: 2,
    read: false,
    timestamp: '2024-01-18T10:15:00',
  },
  // ... 50 more notifications
];

export const mockAnalytics = {
  overall: {
    totalClasses: 8,
    totalAssignments: 45,
    totalStudents: 240,
    averageGrade: 84.5,
    completionRate: 92.3,
  },
  monthly: [
    { month: 'Jan', assignments: 12, submissions: 240, averageGrade: 85.2 },
    { month: 'Feb', assignments: 10, submissions: 200, averageGrade: 83.8 },
    // ... 12 months
  ],
  classPerformance: [
    { className: 'Mathematics 101', averageGrade: 87.5, completionRate: 95.2 },
    { className: 'Advanced CS', averageGrade: 89.1, completionRate: 93.8 },
    // ... all classes
  ],
  studentEngagement: {
    activeStudents: 225,
    inactiveStudents: 15,
    averageLoginFrequency: 4.2,
    averageSubmissionTime: '2 days early',
  },
};
