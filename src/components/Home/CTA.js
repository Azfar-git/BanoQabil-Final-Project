import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Clock } from "lucide-react";

const CTA = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="text-center container-custom">
        <div className=" gap-12 items-center">
          {" "}
          {/*grid grid-cols-1 lg:grid-cols-2*/}
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your IT Career Journey Today
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of successful graduates who have transformed their
              careers with BanoQabil. Our comprehensive programs and expert
              guidance will help you achieve your professional goals.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-center items-center space-x-3">
                <Award className="w-5 h-5" />
                <span>Industry-Recognized Certifications</span>
              </div>
              <div className="flex justify-center items-center space-x-3">
                <Users className="w-5 h-5" />
                <span>Expert Mentors & Career Support</span>
              </div>
              <div className="flex justify-center items-center space-x-3">
                <Clock className="w-5 h-5" />
                <span>Flexible Learning Schedule</span>
              </div>
            </div>

            <div className="flex flex-col justify-center sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
              >
                Apply Now
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/courses"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                Browse Courses
              </Link>
            </div>
          </div>
          {/* <div data-aos="fade-left" className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Limited Time Offer</h3>
              
              <div className="space-y-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-sm opacity-90">Early Bird Discount</div>
                  <div className="text-2xl font-bold">30% OFF</div>
                  <div className="text-sm">On all courses</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-sm opacity-90">Free Workshop</div>
                  <div className="text-xl font-bold">Career Guidance Session</div>
                  <div className="text-sm">With industry experts</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm mb-2">Offer ends in:</div>
                  <div className="flex justify-center space-x-2">
                    {['07', '23', '45', '12'].map((time, index) => (
                      <div key={index} className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                        <div className="text-xl font-bold">{time}</div>
                        <div className="text-xs opacity-90">
                          {['Days', 'Hours', 'Minutes', 'Seconds'][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CTA;
