import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    dateOfBirth: "",
    education: "",
    courseInterest: "",
    agreeToTerms: false, 
  });

  // ✅ Fetch Courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const courseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!formData.agreeToTerms) {
      return setError("You must agree to the terms and conditions");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!formData.courseInterest) {
      return setError("Please select a course");
    }

    setLoading(true);

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      const selectedCourse = courses.find(
        (course) => course.id === formData.courseInterest
      );

      if (!selectedCourse) {
        throw new Error("Selected course not found");
      }

      // ✅ Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        education: formData.education,
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        role: "student",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);

      switch (error.code) {
        case "auth/email-already-in-use":
          setError(
            "This email is already registered. Please use a different email or login."
          );
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak.");
          break;
        default:
          setError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Student Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join Bano Qabil and start your tech journey today
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3 p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {/* Error/Success */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {success}
                    </p>
                  </div>
                )}

                {/* Personal Info */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="student@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    />

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    />
                  </div>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    placeholder="Your complete address"
                    className="w-full mt-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                {/* Education & Course */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Education & Course Selection
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    >
                      <option value="">Select Education</option>
                      <option value="matric">Matriculation</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="other">Other</option>
                    </select>

                    {/* ✅ Dynamic Courses */}
                    <select
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      required
                      disabled={coursesLoading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    >
                      <option value="">
                        {coursesLoading
                          ? "Loading courses..."
                          : "Select Course"}
                      </option>

                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                {/* Terms */}
                <div className="mb-8 flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {loading ? "Processing..." : "Register Now"}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-purple-600 p-6 md:p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Register?</h3>
              <ul className="space-y-3">
                <li>✔ Access to all course materials</li>
                <li>✔ Personal progress tracking</li>
                <li>✔ Certificate upon completion</li>
                <li>✔ Career counseling support</li>
                <li>✔ Community access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
