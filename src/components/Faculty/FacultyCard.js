import React from 'react';
import { Star, GraduationCap, Briefcase, Award, Linkedin, Twitter, Github, ExternalLink } from 'lucide-react';

const FacultyCard = ({ faculty }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 card-hover">
      <div className="relative h-64 overflow-hidden">
        <img
          src={faculty.image}
          alt={faculty.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            {faculty.rating}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{faculty.name}</h3>
        <div className="text-blue-600 dark:text-blue-400 font-medium mb-3">
          {faculty.designation}
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <GraduationCap className="w-4 h-4 mr-2" />
            {faculty.qualification}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="w-4 h-4 mr-2" />
            {faculty.experience} experience
          </div>
        </div>
        
        {/* Expertise */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Expertise:</div>
          <div className="flex flex-wrap gap-2">
            {faculty.expertise.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Courses */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Courses:</div>
          <div className="flex flex-wrap gap-2">
            {faculty.courses.slice(0, 2).map((course, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
              >
                {course}
              </span>
            ))}
            {faculty.courses.length > 2 && (
              <span className="text-gray-500 text-sm">+{faculty.courses.length - 2} more</span>
            )}
          </div>
        </div>
        
        {/* Social Links */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex space-x-3">
            {faculty.social.linkedin && (
              <a href={faculty.social.linkedin} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {faculty.social.twitter && (
              <a href={faculty.social.twitter} className="text-gray-600 dark:text-gray-400 hover:text-blue-400">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {faculty.social.github && (
              <a href={faculty.social.github} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
          
          <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center text-sm">
            View Profile
            <ExternalLink className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;