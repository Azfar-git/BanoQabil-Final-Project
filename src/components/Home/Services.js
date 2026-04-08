import React from 'react';
import service1 from '../../assets/images/services/service1.jpg';
import service2 from '../../assets/images/services/service2.jpg';
import service3 from '../../assets/images/services/service3.jpg';

const Services = () => {
  const service = [
    {
      id: 1,
      title: 'Advanced IT Training',
      description: 'Master the digital landscape with our industry-aligned curriculum. We bridge the gap between academic theory and technical proficiency.',
      image: service1,
    },
    {
      id: 2,
      title: 'Strategic Incubation Centre',
      description: 'Transition from student to professional through hands-on project execution. Build a high-impact portfolio that proves your expertise.',
      image: service2,
    },
    {
      id: 3,
      title: 'Dedicated Job Portal',
      description: 'We don\'t just train; we connect. Access exclusive job openings, freelance opportunities, and career coaching to secure your future.',
      image: service3,
    },
  ];

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <div className="flex flex-col text-center justify-center md:flex-row items-start md:items-center mb-12">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive Solutions to transform you from a learner to a professional
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.map((service, index) => (
            <div
              key={service.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {service.id}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;