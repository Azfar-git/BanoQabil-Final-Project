import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { newsArticles } from '../utils/data';

const NewsDetailsPage = () => {
  const { id } = useParams();
  const article = newsArticles.find(a => a.id === parseInt(id));

  if (!article) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-8">The news article you're looking for doesn't exist.</p>
          <Link to="/news" className="btn-primary inline-flex items-center">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get related articles (excluding current)
  const relatedArticles = newsArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="pt-24 pb-16">
      {/* Back Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="container-custom">
          <Link
            to="/news"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDate(article.date)}
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              By {article.author}
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {article.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Social Share */}
          <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="font-medium">Share this article:</span>
            <div className="flex space-x-3">
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="lead text-xl text-gray-700 dark:text-gray-300 mb-6">
              {article.excerpt}
            </p>

            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-6">
              BanoQabil continues to lead the way in IT education in Pakistan, with groundbreaking 
              achievements and innovations that are transforming the educational landscape. Our commitment 
              to excellence and student success drives everything we do.
            </p>

            <h2 className="text-2xl font-bold mb-4">The Achievement</h2>
            <p className="mb-6">
              This recognition marks a significant milestone in our journey. It validates our approach 
              to hands-on, industry-relevant education and our dedication to producing graduates who are 
              ready to excel in the tech industry from day one.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 p-6 my-8 rounded-r-lg">
              <p className="text-lg font-medium italic">
                "We believe in empowering every student with practical skills that make them 
                industry-ready. This award is a testament to our students' hard work and our 
                faculty's dedication."
              </p>
              <p className="mt-4 font-bold">- Dr. Ali Hassan, Founder & CEO</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Impact on Students</h2>
            <p className="mb-6">
              This achievement directly benefits our students through enhanced learning resources, 
              better industry connections, and increased recognition of their qualifications in 
              the job market.
            </p>

            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>Enhanced learning resources and facilities</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>Stronger industry partnerships and internship opportunities</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>Increased credibility and recognition for graduates</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>Access to exclusive workshops and masterclasses</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Future Plans</h2>
            <p className="mb-6">
              Building on this success, we're excited to announce new initiatives that will further 
              enhance our educational offerings and expand our reach to serve more students across 
              Pakistan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">New Courses</h3>
                <p>Launching specialized programs in emerging technologies</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Campus Expansion</h3>
                <p>Opening new campuses in major cities across Pakistan</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="font-bold mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(article => (
                <div key={article.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs mb-2 inline-block">
                      {article.category}
                    </span>
                    <h3 className="font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {article.excerpt.substring(0, 100)}...
                    </p>
                    <Link
                      to={`/news/${article.id}`}
                      className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetailsPage;