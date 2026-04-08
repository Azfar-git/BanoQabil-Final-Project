import React, { useState } from 'react';
import { Search, Calendar, Filter, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/News/NewsCard';
import { newsArticles } from '../utils/data';

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'courses', name: 'Courses' },
    { id: 'milestones', name: 'Milestones' },
    { id: 'partnerships', name: 'Partnerships' },
    { id: 'events', name: 'Events' },
    { id: 'announcements', name: 'Announcements' },
  ];

  const featuredArticles = newsArticles.filter(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  const filteredArticles = selectedCategory === 'all'
    ? regularArticles
    : regularArticles.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Stay updated with the latest from BanoQabil - achievements, events, and announcements
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredArticles.length > 0 && (
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured News</h2>
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Now
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <div key={article.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <NewsCard article={article} featured={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
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
                    placeholder="Search news articles..."
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <div
                key={article.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl opacity-90 mb-8">
                Subscribe to our newsletter for the latest updates, course announcements, and industry insights
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
              
              <p className="mt-4 text-sm opacity-80">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from BanoQabil
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;