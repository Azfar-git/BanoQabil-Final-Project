import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { MapPin, Phone, Mail, Clock, CheckCircle, Navigation, Search } from 'lucide-react';
import CampusCard from '../components/Campuses/CampusCard';
import { campuses } from '../utils/data';

const CampusesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Campuses data matching the image design
 

  const filteredCampuses = campuses.filter(campus =>
    campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campus.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section - Updated to match image */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Campuses</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Bringing Education Closer to You
            </p>
            <p className="text-base md:text-lg opacity-80 max-w-3xl mx-auto">
              Find a Bano Qabil campus near you. We're here to serve you better across Karachi with multiple accessible locations.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding -mt-8 md:-mt-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by campus or area name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Campuses List */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCampuses.map((campus, index) => (
              <div
                key={campus.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Campus Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={campus.image}
                    alt={campus.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Campus Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {campus.name}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{campus.address}</span>
                      </div>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(campus.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>

                  {/* Campus Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{campus.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{campus.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Courses & Facilities */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {campus.facilities.map((facility, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampuses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No campuses found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Can't Find Your Area?</h2>
            <p className="text-lg opacity-90 mb-8">
              We're expanding! New campuses are opening soon in more locations across Pakistan.
              Contact us to suggest a location or inquire about upcoming campuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+922112345678"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call for Information
              </a>
              <Link
              to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10 rounded-lg font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampusesPage;