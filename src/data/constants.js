// Application Constants
export const APP_NAME = 'Google Classroom';
export const APP_VERSION = '1.0.0';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

// Assignment Status
export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
};

// Submission Status
export const SUBMISSION_STATUS = {
  NOT_SUBMITTED: 'not_submitted',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RETURNED: 'returned',
};

// Grade Scale
export const GRADE_SCALE = {
  A: { min: 90, label: 'A' },
  B: { min: 80, label: 'B' },
  C: { min: 70, label: 'C' },
  D: { min: 60, label: 'D' },
  F: { min: 0, label: 'F' },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ASSIGNMENT_DUE: 'assignment_due',
  GRADE_POSTED: 'grade_posted',
  COMMENT_ADDED: 'comment_added',
  CLASS_ANNOUNCEMENT: 'class_announcement',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';

// Validation Rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'],
};

export default {
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  USER_ROLES,
  ASSIGNMENT_STATUS,
  SUBMISSION_STATUS,
  GRADE_SCALE,
  NOTIFICATION_TYPES,
  VALIDATION_RULES,
};
