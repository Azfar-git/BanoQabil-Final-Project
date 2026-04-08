import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";

const AdmissionRoadmap = () => {
  const [activeStep, setActiveStep] = useState(0);

  const roadmapSteps = [
    {
      id: 1,
      title: 'Explore Courses',
      description: '"Explore IT courses tailored to your career goals.',
      duration: "1-2 Days",
      status: 'completed',
      details: [
        'Visit courses page',
        'Review course curriculum',
        'Check prerequisites',
        'Watch course preview'
      ]
    },
    {
      id: 2,
      title: "Registration",
      description: "Online or at designated centers",
      duration: "1-2 Days",
      status: "current",
      details: [
        "Start your journey by registering through our online portal or visiting any of our designated centers across Karachi.",
      ],
    },
    {
      id: 3,
      title: "Aptitude Test",
      description:
        "Basic English, logical reasoning, math, and course-related questions",
      duration: "1 Day",
      status: "upcoming",
      details: [
        "Demonstrate your foundational knowledge and problem-solving skills through our comprehensive aptitude assessment.",
      ],
    },
    {
      id: 4,
      title: "Interview",
      description: "Assess interest, motivation, and commitment",
      duration: "2 Hours",
      status: "upcoming",
      details: [
        "Meet with our team to discuss your goals, passion for learning, and dedication to completing the program.",
      ],
    },
    {
      id: 5,
      title: "Security Deposit",
      description: "PKR 3,000 refundable deposit",
      duration: "30-45 mins",
      status: "upcoming",
      details: [
        "Submit a fully refundable security deposit to confirm your enrollment and secure your spot in the program.",
      ],
    },
    {
      id: 6,
      title: "Campus Selection",
      description: "Choose your nearest campus and feasible time slot",
      duration: "1 Day",
      status: "upcoming",
      details: [
        "Select your preferred campus location and class timings through our online portal for convenient attendance.",
      ],
    },
    {
      id: 7,
      title: "Class Commencement",
      description: "Regular batch classes start",
      duration: "1 Week",
      status: "upcoming",
      details: [
        "Begin your learning journey with structured classes, expert instructors, and hands-on practical sessions.",
      ],
    },
    {
      id: 8,
      title: "Examination",
      description: "Quizzes, assignments, projects, and final exams",
      duration: "1 Week",
      status: "upcoming",
      details: [
        "Demonstrate your skills through continuous assessments, practical projects, and comprehensive final examinations.",
      ],
    },
    {
      id: 9,
      title: "Certification",
      description: "Official certificate awarded at annual convocation",
      duration: "1 Week",
      status: "upcoming",
      details: [
        "Receive your official BanoQabil certificate at our prestigious annual convocation ceremony.",
      ],
    },
  ];

  const admissionStats = [
    { label: "Success Rate", value: "95%", color: "text-green-600" },
    { label: "Processing Time", value: "3-5 Days", color: "text-blue-600" },
    { label: "Student Satisfaction", value: "4.8/5", color: "text-yellow-600" },
    { label: "Placement Rate", value: "85%", color: "text-purple-600" },
  ];

  const requiredDocuments = [
    "CNIC/B-Form Copy",
    "Recent Photograph",
    "Educational Certificates",
    "Domicile Certificate (if applicable)",
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple & Straightforward{" "}
            <span className="text-gradient">Admission Process</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow these 9 easy steps to start your IT career journey with
            BanoQabil
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {admissionStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roadmap Timeline */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>

              {/* Steps */}
              <div className="space-y-8">
                {roadmapSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    <div className="flex items-start space-x-6">
                      {/* Step Number */}
                      <div
                        className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : step.status === "current"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <div
                          className={`${
                            step.status === "completed"
                              ? "text-green-600 dark:text-green-400"
                              : step.status === "current"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-400 dark:text-gray-600"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <CheckCircleIcon className="w-8 h-8" />
                          ) : (
                            <div className="text-xl font-bold">{step.id}</div>
                          )}
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {step.description}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                            {step.duration}
                          </span>
                        </div>

                        {/* Step Details */}
                        <div className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <div
                              key={idx}
                              className="flex items-start text-sm"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                              <span className="text-gray-600 dark:text-gray-400">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action Button */}
                        {step.status === "current" && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                              to="/admission/apply"
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                              Start this step
                              <ArrowForwardIcon className="ml-2 w-5 h-5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Important Information */}
          <div className="space-y-8">
            {/* Documents Required */}
            <div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              data-aos="fade-left"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <DescriptionIcon className="mr-3 text-blue-600 dark:text-blue-400" />
                Documents Required
              </h3>
              <ul className="space-y-3">
                {requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full btn-secondary flex items-center justify-center">
                <DownloadIcon className="mr-2 w-5 h-5" />
                Download Checklist
              </button>
            </div>

            {/* Important Dates */}
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CalendarTodayIcon className="mr-3" />
                Important Dates
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Next Batch Start</span>
                  <span className="font-bold">March 15, 2024</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Admission Deadline</span>
                  <span className="font-bold">March 10, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Orientation Week</span>
                  <span className="font-bold">March 18-22, 2024</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 rounded-lg transition-all duration-300">
                View Academic Calendar
              </button>
            </div>

            {/* Quick Apply */}
            <div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start your admission process now. It only takes 10 minutes!
              </p>
              <div className="space-y-4">
                <Link
                  to="/admission/apply"
                  className="block w-full btn-primary text-center"
                >
                  Apply Online Now
                </Link>
                <Link
                  to="/admission/guidance"
                  className="block w-full btn-secondary text-center"
                >
                  Need Guidance?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center" data-aos="fade-up">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-blue-600 dark:text-blue-400 text-2xl">
                🎓
              </div>
            </div>
            <h4 className="font-bold mb-2">No Upfront Fee</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Pay only after admission confirmation
            </p>
          </div>
          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-green-600 dark:text-green-400 text-2xl">
                💰
              </div>
            </div>
            <h4 className="font-bold mb-2">Easy Installments</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Flexible payment plans available
            </p>
          </div>
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-purple-600 dark:text-purple-400 text-2xl">
                🏆
              </div>
            </div>
            <h4 className="font-bold mb-2">Scholarships</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Merit-based scholarships for deserving students
            </p>
          </div>
        </div> */}

        {/* CTA */}
        <div className="mt-12 text-center" data-aos="fade-up">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to begin your admission journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="mt-4 md:mt-0 btn-primary inline-flex items-center group"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionRoadmap;
