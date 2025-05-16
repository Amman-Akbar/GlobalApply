import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faHandshake, faChartLine, faUsers, faRocket, faHeart, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <motion.header 
        className="bg-[#538be6] text-white py-36  px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About GlobalApply</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Empowering students worldwide to achieve their academic and career goals through innovative solutions.
        </p>
      </motion.header>

      {/* Mission, Vision, Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: faGlobe, title: "Our Mission", content: "To connect students with global educational opportunities and simplify the application process through technology and guidance." },
            { icon: faChartLine, title: "Our Vision", content: "To become the most trusted platform for students worldwide, fostering academic success and career growth." },
            { icon: faHandshake, title: "Our Values", content: "Innovation, transparency, and inclusivity are at the core of everything we do." }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <FontAwesomeIcon icon={item.icon} size="3x" className="text-[#1D5EC7] mb-4" />
              <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
              <p className="text-gray-600">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About GlobalApply */}
      <motion.section 
        className="bg-gray-100 py-16 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Who We Are</h2>
          <p className="text-gray-700 text-lg mb-4">
            GlobalApply is a comprehensive platform designed to help students explore and apply to institutes globally. 
            From finding the right institute to discovering scholarships and getting career counseling, 
            we streamline the entire process, making higher education more accessible and hassle-free.
          </p>
          <p className="text-gray-700 text-lg">
            With cutting-edge technology, personalized recommendations, and virtual campus tours, 
            GlobalApply bridges the gap between students and institutes, empowering the next generation of leaders.
          </p>
        </div>
      </motion.section>

      {/* Additional Details */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: faUsers, title: "Student-Centric Approach", content: "We prioritize students' needs by providing resources, personalized support, and tools to achieve their goals." },
            { icon: faRocket, title: "Cutting-Edge Technology", content: "Our platform leverages advanced technologies, including AI-driven recommendations and virtual tours, to simplify the application journey." },
            { icon: faHeart, title: "Dedicated Team", content: "Our passionate team of experts is committed to supporting students and institutes every step of the way." }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <FontAwesomeIcon icon={item.icon} size="3x" className="text-[#1D5EC7] mb-4" />
              <h2 className="text-xl font-semibold mb-4">{item.title}</h2>
              <p className="text-gray-600">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <motion.section 
        className="bg-gray-100 py-16 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { quote: "GlobalApply made my dream of studying abroad a reality. Their platform is incredibly easy to use, and the support team is amazing!", author: "Sarah, Student" },
              { quote: "As an institute, partnering with GlobalApply has been a game-changer. We've connected with so many talented students globally.", author: "Dr. Johnson, University Dean" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg relative">
                <FontAwesomeIcon icon={faQuoteLeft} size="2x" className="text-[#1D5EC7] opacity-20 absolute top-4 left-4" />
                <p className="text-gray-700 mb-4 relative z-10">{testimonial.quote}</p>
                <p className="font-semibold text-gray-800">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call-to-Action */}
      <motion.section 
        className="py-16 px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <a
          href="/features"
          className="bg-[#1D5EC7] text-white px-8 py-3 rounded-full text-lg shadow-md hover:bg-[#6b41cc] transition-all inline-block"
        >
          Learn More About Our Features
        </a>
      </motion.section>
    </div>
  );
};

export default About;
