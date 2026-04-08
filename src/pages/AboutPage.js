import React from 'react';
import { Target, Users, Award, Globe, Heart, Shield } from 'lucide-react';
import heroImage from '../assets/images/hero/hero.png';
import chief from '../assets/images/members/chief.webp';
import ceo from '../assets/images/members/ceo.jpeg';
import senior from '../assets/images/members/senior-leader.jpg';
import director from '../assets/images/members/director.jpg';


const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Hafiz Naeem ur Rehman',
      role: 'Patron in Chief',
      bio: 'Patron-in-Chief of Bano Qabil, supporting youth empowerment through free IT and digital skills education.',
      image: chief,
    },
    {
      id: 2,
      name: 'Naveed Ali Baig',
      role: 'CEO, Bano Qabil',
      bio: 'CEO of Bano Qabil, leading nationwide programs to prepare Pakistan’s youth for modern tech careers.',
      image: ceo,
    },
    {
      id: 3,
      name: 'Farooq Kamalani',
      role: 'Director, Bano Qabil Program',
      bio: 'Director of the Bano Qabil Program, overseeing training operations and curriculum quality.',
      image: director,
    },
    {
      id: 4,
      name: 'Shahid Iqbal',
      role: 'Chief Executive / Senior Leadership',
      bio: 'Senior leadership executive at Bano Qabil, contributing to strategy and program execution.',
      image: senior,
    },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do',
      color: 'blue',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Building a supportive learning community',
      color: 'purple',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality',
      description: 'Highest quality education standards',
      color: 'green',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Accessibility',
      description: 'Making education accessible to all',
      color: 'orange',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Passion',
      description: 'Teaching with passion and dedication',
      color: 'red',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Integrity',
      description: 'Honest and transparent in all dealings',
      color: 'indigo',
    },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About BanoQabil</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Empowering Pakistan's youth with world-class IT education since 2015
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To bridge the gap between academia and industry by providing practical, 
                industry-relevant IT education that empowers individuals to build successful 
                careers and contribute to Pakistan's digital transformation.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                We believe that quality education should be accessible to everyone, 
                regardless of their background or financial situation.
              </p>
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To become Pakistan's leading IT education platform, recognized for 
                producing highly skilled professionals who drive innovation and 
                technological advancement in the country.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                We envision a future where every Pakistani has access to quality 
                technical education and the opportunity to thrive in the digital economy.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  BanoQabil was founded in 2015 by Dr. Ali Hassan with a simple yet powerful vision: 
                  to make quality IT education accessible to every Pakistani youth.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  What started as a small training center in Karachi with just 20 students 
                  has grown into a nationwide movement, training over 5,000 students across 
                  Pakistan.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Today, we're proud to be at the forefront of IT education in Pakistan, 
                  constantly innovating and adapting to meet the evolving needs of the 
                  industry and our students.
                </p>
              </div>
              <div className="relative">
                <img
                  src= {heroImage}
                  alt="BanoQabil students"
                  className="rounded-xl shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg max-w-xs">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Students Transformed Since 2015</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg card-hover text-center"
                >
                  <div className={`w-16 h-16 rounded-full bg-${value.color}-100 dark:bg-${value.color}-900/20 flex items-center justify-center mx-auto mb-4`}>
                    <div className={`text-${value.color}-600 dark:text-${value.color}-400`}>
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg card-hover"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                      {member.role}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Be part of Pakistan's digital revolution. Together, we can build a brighter future through education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
              Partner With Us
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-all duration-300">
              Join as Instructor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;