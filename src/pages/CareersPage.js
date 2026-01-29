import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { uploadCV } from '../firebase/storage';
import { auth, db } from '../firebase/config';
import { User, Mail, Phone, Briefcase, FileText, Upload, X, Plus } from 'lucide-react';

const CareersPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    skills: []
  });
  
  const [cvFile, setCvFile] = useState(null);
  const [skillInput, setSkillInput] = useState('');

  // Available positions
  const positions = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Digital Marketing Specialist',
    'Data Science Mentor',
    'Graphic Designer',
    'Content Writer',
    'Community Manager',
    'Operations Coordinator',
    'IT Support Specialist',
    'Project Manager',
    'Quality Assurance Engineer',
    'DevOps Engineer',
    'Open for any position'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, Word document, or text file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      setCvFile(file);
      setError('');
    }
  };

  const generatePassword = (email) => {
    // Create a password from email and timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `BQ${timestamp}${email.split('@')[0].slice(0, 3)}!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.position) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    if (!cvFile) {
      setError('Please upload your CV/Resume');
      return;
    }

    setLoading(true);

    try {
      // Generate password for the applicant
      const password = generatePassword(formData.email);

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        password
      );

      const user = userCredential.user;
      console.log("User created in Auth:", user.uid);

      // 2. Upload CV to Firebase Storage
      const cvUploadResult = await uploadCV(cvFile, user.uid);
      
      if (!cvUploadResult.success) {
        throw new Error('Failed to upload CV');
      }

      // 3. Save employee data to Firestore
      const employeeData = {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        skills: formData.skills,
        cvUrl: cvUploadResult.url,
        cvFileName: cvUploadResult.fileName,
        cvFileType: cvUploadResult.fileType,
        cvFileSize: cvUploadResult.fileSize,
        appliedAt: new Date().toISOString(),
        status: 'pending_review',
        role: 'applicant',
        accountCreated: true,
        applicationStage: 'application_submitted'
      };

      await setDoc(doc(db, 'employees', user.uid), employeeData);
      
      console.log("Employee data saved to Firestore:", employeeData);

      // 4. Also save to applications collection for tracking
      await setDoc(doc(db, 'applications', user.uid), {
        ...employeeData,
        reviewed: false,
        notes: '',
        reviewer: null,
        reviewDate: null
      });

      setSuccess('Application submitted successfully! We will contact you soon.');

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        skills: []
      });
      setCvFile(null);
      setSkillInput('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      // Show success for 5 seconds then optionally redirect
      setTimeout(() => {
        setSuccess('');
        // navigate('/'); // Uncomment to redirect after submission
      }, 5000);

    } catch (error) {
      console.error('Application error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please use a different email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please try again.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Please contact support.');
          break;
        default:
          setError('Application failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  // Add this to CareerPage.js to check
console.log("Firebase auth object:", auth);
console.log("Firebase auth app name:", auth.app.name);
console.log("Firebase db object:", db);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Career Opportunities
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Be part of Pakistan's largest free IT training initiative
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Apply Now</h2>
            <p className="opacity-90">
              Fill in your details and upload your CV to apply for available positions.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Section A: Full Name */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">A</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Full Name
                    </h3>
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Section B: Email Address */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">B</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Email Address
                    </h3>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Section C: Phone Number */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">C</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Phone Number
                    </h3>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>

                {/* Section D: Position */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">D</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Position Applying For
                    </h3>
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-10 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="">Select a position</option>
                      {positions.map((position, index) => (
                        <option key={index} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    e.g., Full Stack Developer, UX/UI Designer, or Open for any position
                  </p>
                </div>

                {/* Section E: Skills */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">E</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Skills
                    </h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="Enter a skill and press Enter or click Add"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Skills Tags */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-blue-600 dark:text-blue-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section F: Upload CV */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">F</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Upload CV/Resume
                    </h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    {cvFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-green-500 mb-3" />
                        <p className="font-medium text-gray-800 dark:text-white mb-1">
                          {cvFile.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() => setCvFile(null)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Click to upload your CV
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          For Word documents (Max 5MB)
                        </p>
                        <label className="inline-block">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            required
                          />
                          <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer">
                            Upload CV/Resume
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 text-lg font-bold rounded-lg transition-all duration-300 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1'
                    } text-white shadow-lg hover:shadow-xl`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting Application...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;