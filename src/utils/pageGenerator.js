import React from 'react';

const pages = [
  { name: 'NotificationSettings', path: 'src/pages/Settings/NotificationSettings.jsx' },
  { name: 'ClassSettings', path: 'src/pages/Settings/ClassSettings.jsx' },
  { name: 'GradebookView', path: 'src/pages/Gradebook/GradebookView.jsx' },
  { name: 'GradebookSettings', path: 'src/pages/Gradebook/GradebookSettings.jsx' },
  { name: 'StudentProgress', path: 'src/pages/Gradebook/StudentProgress.jsx' },
  { name: 'AssignmentList', path: 'src/pages/Assignment/AssignmentList.jsx' },
  { name: 'AssignmentDetail', path: 'src/pages/Assignment/AssignmentDetail.jsx' },
  { name: 'SubmissionPage', path: 'src/pages/Assignment/SubmissionPage.jsx' },
  { name: 'GradingPage', path: 'src/pages/Assignment/GradingPage.jsx' },
  { name: 'UserManagement', path: 'src/pages/Admin/UserManagement.jsx' },
  { name: 'ClassManagement', path: 'src/pages/Admin/ClassManagement.jsx' },
  { name: 'Analytics', path: 'src/pages/Admin/Analytics.jsx' },
];

const createPlaceholder = (name) => `import React from 'react';

export default function ${name}() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${name}</h1>
        <div className="bg-white rounded-lg shadow-card p-8">
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}`;

export default createPlaceholder;
