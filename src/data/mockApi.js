// Mock API endpoints
export const mockApiEndpoints = {
  // User endpoints
  login: '/api/auth/login',
  register: '/api/auth/register',
  getUser: '/api/user/profile',
  updateUser: '/api/user/profile',

  // Classes endpoints
  getClasses: '/api/classes',
  getClassById: '/api/classes/:id',
  createClass: '/api/classes',
  updateClass: '/api/classes/:id',
  deleteClass: '/api/classes/:id',

  // Assignments endpoints
  getAssignments: '/api/assignments',
  getAssignmentById: '/api/assignments/:id',
  createAssignment: '/api/assignments',
  updateAssignment: '/api/assignments/:id',
  deleteAssignment: '/api/assignments/:id',

  // Grades endpoints
  getGrades: '/api/grades',
  updateGrade: '/api/grades/:id',

  // Students endpoints
  getStudents: '/api/students',
  getStudentById: '/api/students/:id',
};

// Mock API functions
export const api = {
  // Get with mock delay
  get: async (endpoint) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: [] };
  },

  // Post with mock delay
  post: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data };
  },

  // Put with mock delay
  put: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data };
  },

  // Delete with mock delay
  delete: async (endpoint) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
};

export default api;
