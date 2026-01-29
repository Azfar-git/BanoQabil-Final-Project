import React from 'react';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article, featured = false }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 card-hover ${
      featured ? 'md:col-span-2' : ''
    }`}>
      <div className={`${featured ? 'md:flex' : ''}`}>
        <div className={`${featured ? 'md:w-1/2' : ''}`}>
          <div className="relative h-48 md:h-full overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
            />
            {article.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-6 ${featured ? 'md:w-1/2' : ''}`}>
          <div className="flex items-center space-x-4 mb-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
              {article.category}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(article.date)}
            </div>
          </div>
          
          <h3 className={`font-bold mb-3 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {article.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {article.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs flex items-center"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-2" />
              By {article.author}
            </div>
            
            <Link
              to={`/news/${article.id}`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center"
            >
              Read More
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;