import React, { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  CheckCircle,
  BookOpen,
} from "lucide-react";

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile Development" },
    { id: "ai", name: "AI & Machine Learning" },
    { id: "cybersecurity", name: "Cyber Security" },
    { id: "data", name: "Data Science & Analytics" },
    { id: "devops", name: "DevOps & Cloud" },
    { id: "design", name: "UI/UX Design" },
    { id: "marketing", name: "Digital Marketing" },
    { id: "ecommerce", name: "E-Commerce" },
    { id: "creative", name: "Creative & Media" },
    { id: "programming", name: "Programming" },
    { id: "game-dev", name: "Game Development" },
    { id: "business", name: "Business & Entrepreneurship" },
    { id: "it", name: "IT Fundamentals" },
    { id: "testing", name: "QA & Testing" },
  ];

  const courses = [
    {
      id: 1,
      title: "MERN Stack Development",
      description:
        "Master the Full Lifecycle of a SaaS Product - From Database Schema to Cloud Deployment",
      duration: "4 Months",
      level: "Advanced",
      students: "2450",
      rating: 4.8,
      category: "web",
      features: [
        "Live Sessions",
        "Real Projects",
        "AWS Deployment",
        "Job Support",
        "Portfolio Building",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Digital Journalism",
      description:
        "Mobile Journalism & Content Creation - Video Production, Editing & Social Media Strategy",
      duration: "4 Months",
      level: "Beginner",
      students: "1250",
      rating: 4.7,
      category: "marketing",
      features: [
        "Mobile Journalism",
        "Video Editing",
        "Social Media Strategy",
        "Portfolio Review",
        "Certificate",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "AI for Everyone",
      description:
        "Complete AI Course for Beginners - Understand and Master Generative AI Tools",
      duration: "4 Months",
      level: "Beginner",
      students: "3850",
      rating: 4.9,
      category: "ai",
      features: [
        "AI Tools Training",
        "Hands-on Projects",
        "Industry Use Cases",
        "Certificate",
        "Community Access",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Cyber Security Fundamentals",
      description:
        "Cybersecurity Training - SOC Analyst, Network Security & Ethical Hacking Fundamentals",
      duration: "4 Months",
      level: "Intermediate",
      students: "1950",
      rating: 4.6,
      category: "cybersecurity",
      features: [
        "Hands-on Labs",
        "Certification Prep",
        "Network Security",
        "Job Support",
        "Real-world Scenarios",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Data Analytics & BI",
      description:
        "Data Analytics Course - Master Google Sheets, SQL, Power Query & Business Intelligence",
      duration: "4 Months",
      level: "Intermediate",
      students: "2250",
      rating: 4.8,
      category: "data",
      features: [
        "Real Datasets",
        "Power BI Projects",
        "SQL Practice",
        "Certificate",
        "Career Guidance",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "DevOps Foundations",
      description:
        "Learn DevOps - CI/CD, Docker, AWS, GitHub Actions & Cloud Deployment",
      duration: "3 Months",
      level: "Intermediate",
      students: "1850",
      rating: 4.7,
      category: "devops",
      features: [
        "AWS Labs",
        "Docker Projects",
        "CI/CD Pipeline",
        "Certificate",
        "Industry Tools",
      ],
      popular: false,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      title: "UI-UX Design with Figma",
      description:
        "UI/UX Design Course - Learn Figma, Wireframing, Prototyping & User-Centered Design",
      duration: "4 Months",
      level: "Beginner",
      students: "2750",
      rating: 4.8,
      category: "design",
      features: [
        "Figma Mastery",
        "Design Systems",
        "Portfolio Projects",
        "Certificate",
        "Design Thinking",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      title: "Python Programming",
      description:
        "Complete Python Course - From Beginner to Building REST APIs with FastAPI",
      duration: "4 Months",
      level: "Beginner",
      students: "4550",
      rating: 4.9,
      category: "programming",
      features: [
        "Coding Exercises",
        "API Projects",
        "FastAPI Framework",
        "Certificate",
        "Code Reviews",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1526379879527-8559ecfcaec9?w=400&h=300&fit=crop",
    },
    {
      id: 9,
      title: "Prompt Engineering for Beginners",
      description:
        "Master AI Orchestration - From Structural Frameworks to Agentic Prompting",
      duration: "4 Months",
      level: "Beginner",
      students: "3250",
      rating: 4.8,
      category: "ai",
      features: [
        "Advanced Prompting",
        "AI Tools Integration",
        "Practical Exercises",
        "Certificate",
        "Best Practices",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    },
    {
      id: 10,
      title: "Computer Information and Technology",
      description:
        "Master Essential IT Skills - Google Sheets, Excel, Programming Logic, Prompt Engineering & Git",
      duration: "4 Months",
      level: "Beginner",
      students: "1850",
      rating: 4.6,
      category: "it",
      features: [
        "IT Fundamentals",
        "Office Tools",
        "Basic Programming",
        "Certificate",
        "Career Skills",
      ],
      popular: false,
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    },
    {
      id: 11,
      title: "Video Editing & Animations",
      description:
        "Professional Video Editing Course - Master Adobe Premiere Pro & After Effects for Motion Graphics",
      duration: "4 Months",
      level: "Intermediate",
      students: "1650",
      rating: 4.7,
      category: "creative",
      features: [
        "Premiere Pro",
        "After Effects",
        "Motion Graphics",
        "Certificate",
        "Portfolio Projects",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    },
    {
      id: 12,
      title: "DevOps Foundations",
      description:
        "Learn DevOps - CI/CD, Docker, AWS, GitHub Actions & Cloud Deployment",
      duration: "4 Months",
      level: "Intermediate",
      students: "1950",
      rating: 4.7,
      category: "devops",
      features: [
        "Cloud Deployment",
        "Infrastructure as Code",
        "Monitoring Tools",
        "Certificate",
        "Real Projects",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
    },
    {
      id: 13,
      title: "Digital Forensics and Ethical Hacking",
      description:
        "Master the Red vs. Blue lifecycle: From Adversarial Attacks to Digital Forensic Investigation",
      duration: "4 Months",
      level: "Advanced",
      students: "1450",
      rating: 4.8,
      category: "cybersecurity",
      features: [
        "Penetration Testing",
        "Forensic Tools",
        "Legal Aspects",
        "Certificate",
        "Hands-on Labs",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    },
    {
      id: 14,
      title: "Frontend Development with React & Next.JS",
      description:
        "Become a Production-Ready Frontend Engineer - Mastering React, Next.js 15 & Modern Design Systems",
      duration: "4 Months",
      level: "Intermediate",
      students: "2950",
      rating: 4.9,
      category: "web",
      features: [
        "React Mastery",
        "Next.js 15",
        "TypeScript",
        "Certificate",
        "Deployment",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    },
    {
      id: 15,
      title: "Game Development with Blender",
      description:
        "Design High-Fidelity 3D Assets — Master Modeling, Sculpting, and Character Animation in Blender.",
      duration: "4 Months",
      level: "Intermediate",
      students: "1250",
      rating: 4.7,
      category: "game-dev",
      features: [
        "3D Modeling",
        "Character Animation",
        "Texturing",
        "Certificate",
        "Portfolio Assets",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    },
    {
      id: 16,
      title: "Game Development with Unity",
      description:
        "Create Immersive 2D & 3D Games — Master C# Scripting and Advanced Gameplay Systems in Unity.",
      duration: "4 Months",
      level: "Intermediate",
      students: "2350",
      rating: 4.8,
      category: "game-dev",
      features: [
        "Unity Engine",
        "C# Programming",
        "Game Physics",
        "Certificate",
        "Playable Projects",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
    },
    {
      id: 17,
      title: "Mobile Application Development with Flutter",
      description:
        "Master the Dart Language and Build High-Performance iOS & Android Apps from a Single Codebase",
      duration: "4 Months",
      level: "Intermediate",
      students: "2750",
      rating: 4.8,
      category: "mobile",
      features: [
        "Flutter Framework",
        "Dart Language",
        "Cross-Platform",
        "Certificate",
        "App Store Deployment",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    },
    {
      id: 18,
      title: "No-Code Development",
      description:
        "Build Production-Ready Applications without Code - Master Airtable, Zapier, Bubble & FlutterFlow",
      duration: "4 Months",
      level: "Beginner",
      students: "2150",
      rating: 4.7,
      category: "web",
      features: [
        "No-Code Tools",
        "Automation",
        "App Deployment",
        "Certificate",
        "Business Applications",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
    {
      id: 19,
      title: "SQA & Test Engineering",
      description:
        "Complete QA Transformation - Master Selenium, Appium, JMeter, CI/CD, and Professional Bug Management",
      duration: "4 Months",
      level: "Intermediate",
      students: "1650",
      rating: 4.6,
      category: "testing",
      features: [
        "Automated Testing",
        "Performance Testing",
        "Bug Tracking",
        "Certificate",
        "CI/CD Integration",
      ],
      popular: false,
      image:
        "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=400&h=300&fit=crop",
    },
    {
      id: 20,
      title: "Web Development with AI",
      description:
        "Complete Web Development Course - Learn HTML, CSS & JavaScript from Scratch to Build Responsive Websites",
      duration: "4 Months",
      level: "Beginner",
      students: "3350",
      rating: 4.8,
      category: "web",
      features: [
        "HTML/CSS/JS",
        "AI Tools",
        "Responsive Design",
        "Certificate",
        "Hosting & Deployment",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=300&fit=crop",
    },
    {
      id: 21,
      title: "Content Writing",
      description:
        "Content Writing & Copywriting Course - SEO, AI Tools & Freelancing on Upwork/Fiverr",
      duration: "4 Months",
      level: "Beginner",
      students: "2450",
      rating: 4.7,
      category: "marketing",
      features: [
        "SEO Writing",
        "Copywriting",
        "Freelance Guide",
        "Certificate",
        "Portfolio Building",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
    },
    {
      id: 22,
      title: "Digital Entrepreneurship for Women",
      description:
        "This course is designed to empower women with practical digital entrepreneurship skills using only a mobile phone.",
      duration: "4 Months",
      level: "Beginner",
      students: "1850",
      rating: 4.9,
      category: "business",
      features: [
        "Mobile Business",
        "E-commerce",
        "Social Media",
        "Certificate",
        "Mentorship",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1551836026-d5c2c2c06c7a?w=400&h=300&fit=crop",
    },
    {
      id: 23,
      title: "Digital Marketing",
      description:
        "Complete Digital Marketing Course - Social Media, SEO, Google Ads & Freelancing Success",
      duration: "4 Months",
      level: "Beginner",
      students: "3850",
      rating: 4.8,
      category: "marketing",
      features: [
        "SEO Strategy",
        "Social Media Ads",
        "Analytics",
        "Certificate",
        "Campaign Management",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 24,
      title: "Facebook & Youtube Automations",
      description:
        "Automation-based content business using only a mobile phone, launch and manage monetized social media channels",
      duration: "4 Months",
      level: "Beginner",
      students: "1550",
      rating: 4.6,
      category: "marketing",
      features: [
        "Content Automation",
        "Monetization",
        "Analytics",
        "Certificate",
        "Growth Hacking",
      ],
      popular: false,
      image:
        "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop",
    },
    {
      id: 25,
      title: "Social Media Management",
      description:
        "Social Media Manager Course - Facebook, Instagram Marketing, Content Strategy & Analytics",
      duration: "4 Months",
      level: "Beginner",
      students: "2650",
      rating: 4.7,
      category: "marketing",
      features: [
        "Content Strategy",
        "Community Management",
        "Analytics Tools",
        "Certificate",
        "Brand Building",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h-300&fit=crop",
    },
    {
      id: 26,
      title: "Amazon Virtual Assistant",
      description:
        "Amazon Wholesale & Online Arbitrage - Complete FBA Virtual Assistant Training",
      duration: "4 Months",
      level: "Beginner",
      students: "1950",
      rating: 4.7,
      category: "ecommerce",
      features: [
        "Amazon FBA",
        "Product Research",
        "Listing Optimization",
        "Certificate",
        "Client Management",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 27,
      title: "Daraz Ecosystem",
      description:
        "Structured, hands-on training for Daraz Marketplace, launch, manage, and grow a professional Daraz seller account.",
      duration: "4 Months",
      level: "Beginner",
      students: "1250",
      rating: 4.6,
      category: "ecommerce",
      features: [
        "Daraz Platform",
        "Inventory Management",
        "Customer Service",
        "Certificate",
        "Sales Strategy",
      ],
      popular: false,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      id: 28,
      title: "E-Commerce Development",
      description:
        "Build Online Stores with Shopify, WordPress & WooCommerce - Complete E-Commerce Course",
      duration: "4 Months",
      level: "Intermediate",
      students: "2150",
      rating: 4.8,
      category: "web",
      features: [
        "Shopify Development",
        "WooCommerce",
        "Payment Integration",
        "Certificate",
        "Store Optimization",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    },
    {
      id: 29,
      title: "Graphic Designing Essentials",
      description:
        "Learn Graphic Design - Master Adobe Illustrator & Photoshop for Professional Branding",
      duration: "4 Months",
      level: "Beginner",
      students: "2950",
      rating: 4.8,
      category: "creative",
      features: [
        "Adobe Illustrator",
        "Photoshop",
        "Brand Identity",
        "Certificate",
        "Portfolio Development",
      ],
      popular: true,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
  ];

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Courses</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore our comprehensive IT courses designed to launch your tech
            career
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 card-hover"
              >
                {/* Course Header */}
                <div className="relative">
                  <div className="relative h-48 overflow-hidden group">
                    {/* Image container with hover effect */}
                    <div className="relative w-full h-full">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform transition-all duration-700 ease-in-out group-hover:scale-110"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* Popular badge */}
                    {course.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Popular
                        </span>
                      </div>
                    )}

                    {/* Course ID badge */}
                    <div className="absolute -bottom-3 left-6 z-20">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">
                          {course.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6 pt-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {course.category.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {course.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Course Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{course.students} students</span>
                    </div>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold">{course.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({Math.floor(course.students / 10)})
                      </span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button className="w-full mt-4 btn-primary">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                No courses found in this category
              </div>
              <button
                onClick={() => setSelectedCategory("all")}
                className="btn-primary"
              >
                View All Courses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 dark:bg-gray-800 section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Help Choosing a Course?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Our career advisors are here to help you choose the right course
            based on your goals and background.
          </p>
          <button className="btn-primary">Schedule Free Consultation</button>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
