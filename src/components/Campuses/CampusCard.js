import React from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

const CampusCard = ({ campus }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 card-hover">
      <div className="relative h-48 overflow-hidden">
        <img
          src={campus.image}
          alt={campus.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
            Main Campus
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{campus.name}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <span className="text-gray-600 dark:text-gray-300">{campus.address}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">{campus.phone}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">{campus.email}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">{campus.timing}</span>
          </div>
        </div>
        
        {/* Facilities */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Facilities:</div>
          <div className="flex flex-wrap gap-2">
            {campus.facilities.slice(0, 3).map((facility, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{facility}</span>
              </div>
            ))}
            {campus.facilities.length > 3 && (
              <span className="text-gray-500 text-sm">
                +{campus.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Courses Offered */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Courses Offered:</div>
          <div className="flex flex-wrap gap-2">
            {campus.courses.map((course, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
        
        <button className="w-full btn-primary mt-4">
          Visit Campus
        </button>
      </div>
    </div>
  );
};

export default CampusCard;