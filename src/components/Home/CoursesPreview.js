import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

const CoursesPreview = () => {
  const courses = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Learn MERN stack with modern tools and best practices',
      duration: '6 Months',
      students: '1200',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'web',
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'Build iOS & Android apps with React Native',
      duration: '4 Months',
      students: '850',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'mobile',
    },
    {
      id: 3,
      title: 'Artificial Intelligence',
      description: 'Master AI/ML with Python and TensorFlow',
      duration: '8 Months',
      students: '650',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'ai',
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Learn from industry experts and build your career
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 btn-primary inline-flex items-center group"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            View All Courses
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-bold">{course.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400">(500+)</span>
                  </div>
                  <Link
                    to={`/courses#${course.category}`}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center"
                  >
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;