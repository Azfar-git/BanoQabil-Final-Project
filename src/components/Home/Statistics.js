import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Briefcase, Award } from 'lucide-react';

const Statistics = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    placed: 0,
    awards: 0,
  });

  const targetStats = {
    students: 5000,
    courses: 25,
    placed: 3500,
    awards: 20,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        students: Math.min(prev.students + 50, targetStats.students),
        courses: Math.min(prev.courses + 1, targetStats.courses),
        placed: Math.min(prev.placed + 35, targetStats.placed),
        awards: Math.min(prev.awards + 1, targetStats.awards),
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      icon: <Users className="w-8 h-8" />,
      value: stats.students.toLocaleString(),
      label: 'Students Trained',
      suffix: '+',
      color: 'blue',
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      value: stats.courses,
      label: 'Courses',
      suffix: '+',
      color: 'purple',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      value: stats.placed.toLocaleString(),
      label: 'Students Placed',
      suffix: '+',
      color: 'green',
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: stats.awards,
      label: 'Awards Won',
      suffix: '+',
      color: 'orange',
    },
  ];

  return (
    <section className="section-padding gradient-bg text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="opacity-90 max-w-2xl mx-auto">
            Transforming lives through quality IT education and career development
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div
              key={stat.label}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
                <span className="text-2xl">{stat.suffix}</span>
              </div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;