import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const sliderRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Ahmed Raza',
      role: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      content: 'BanoQabil transformed my career. The web development course gave me practical skills that helped me land my dream job within 2 months of completion.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      name: 'Sara Khan',
      role: 'Mobile App Developer',
      company: 'Digital Innovations',
      content: 'The mobile app development course is exceptional. The instructors are industry experts who provide real-world insights. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      name: 'Bilal Ahmed',
      role: 'AI Engineer',
      company: 'Future Tech',
      content: 'As a graduate of the AI course, I can confidently say that BanoQabil provides world-class education at an affordable price.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 4,
      name: 'Fatima Zoha',
      role: 'Cyber Security Analyst',
      company: 'SecureNet',
      content: 'The cyber security program exceeded my expectations. The hands-on labs and industry projects prepared me for real challenges.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from our alumni who have transformed their careers with BanoQabil
          </p>
        </div>

        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg h-full">
                  <Quote className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => sliderRef.current.slickPrev()}
              className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => sliderRef.current.slickNext()}
              className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;