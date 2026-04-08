import React, { useState } from "react";
import { Search, Filter, Star, Users, Award, BookOpen } from "lucide-react";
import FacultyCard from "../components/Faculty/FacultyCard";
import { facultyMembers } from "../utils/data";

const FacultyPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "cs", name: "Computer Science" },
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile Development" },
    { id: "ai", name: "AI & Machine Learning" },
    { id: "cyber", name: "Cyber Security" },
    { id: "design", name: "UI/UX Design" },
    { id: "data", name: "Data Science" },
    { id: "ecommerce", name: "E-Commerce" },
    { id: "marketing", name: "Digital Marketing" },
  ];

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "25+",
      label: "Expert Faculty",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "150+",
      label: "Years Combined Experience",
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: "4.8",
      label: "Average Rating",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: "50+",
      label: "Courses Taught",
    },
  ];

  const filteredFaculty = facultyMembers.filter((faculty) => {
    const matchesDepartment =
      selectedDepartment === "all" ||
      faculty.designation.toLowerCase().includes(selectedDepartment);

    const matchesSearch =
      searchTerm === "" ||
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.expertise.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Expert Faculty
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Learn from industry experts with years of teaching and professional
            experience
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                  <div className="text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search faculty by name or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Filters */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedDepartment === dept.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((faculty, index) => (
              <div
                key={faculty.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <FacultyCard faculty={faculty} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredFaculty.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                No faculty members found matching your criteria
              </div>
              <button
                onClick={() => {
                  setSelectedDepartment("all");
                  setSearchTerm("");
                }}
                className="btn-primary"
              >
                View All Faculty
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Join Faculty CTA */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want to Join Our Faculty?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              We're always looking for passionate educators and industry experts
              to join our team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                View Open Positions
              </a>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-all duration-300">
                Submit Your CV
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyPage;
