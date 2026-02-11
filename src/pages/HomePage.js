import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Clock, CheckCircle } from "lucide-react";
import Hero from "../components/Home/Hero";
import Statistics from "../components/Home/Statistics";
import Services from "../components/Home/Services";
import CoursesPreview from "../components/Home/CoursesPreview";
import AdmissionRoadmap from "../components/Home/AdmissionRoadmap";
import Testimonials from "../components/Home/Testimonials";
import CTA from "../components/Home/CTA";

const HomePage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
      color: "blue",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Programs",
      description: "Get recognized certificates upon course completion",
      color: "purple",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Schedule",
      description: "Learn at your own pace with recorded sessions",
      color: "green",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Practical Projects",
      description: "Hands-on experience with real-world projects",
      color: "orange",
    },
  ];

  return (
    <>
      <Hero />

      {/* Features Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose BanoQabil?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the best learning experience with industry-relevant
              curriculum and expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center mb-4`}
                >
                  <div
                    className={`text-${feature.color}-600 dark:text-${feature.color}-400`}
                  >
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Statistics />
      <Services />
      <CoursesPreview />
      <AdmissionRoadmap />
      <Testimonials />
      <CTA />
    </>
  );
};

export default HomePage;
