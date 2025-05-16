import React from 'react';
import about1 from '../../assets/images/about1.svg';
import about2 from '../../assets/images/about2.svg';

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          About Our Organization
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <img
              src={about1}
              alt="What We Do"
              className="w-full h-64 object-contain rounded-lg shadow-md"
            />
            <h3 className="text-2xl font-semibold text-slate-700">What We Do</h3>
            <p className="text-gray-700">
              At GlobalApply, we provide students with essential resources to simplify their application journey. 
              From detailed information about various courses and virtual campus tours, our platform aims to empower 
              students worldwide to make informed decisions about their higher education.
            </p>
          </div>

          <div className="space-y-6">
            <img
              src={about2}
              alt="Our Impact"
              className="w-full h-64 object-contain rounded-lg shadow-md"
            />
            <h3 className="text-2xl font-semibold text-slate-700">Our Impact</h3>
            <p className="text-gray-700">
              We've helped thousands of students successfully apply to top institutions. Our platform continues 
              to evolve, ensuring the best resources are available to students on their academic journeys. 
              Join us in shaping the future of education and career opportunities worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

