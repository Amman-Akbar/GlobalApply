import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUniversity,
  faUserGraduate,
  faSearch,
  faHandsHelping,
  faPencilAlt,
  faVrCardboard,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: faUniversity,
      title: "Explore Top Institutes",
      description:
        "Browse a vast directory of global institutes categorized by fields of study, location, and fees. Find the perfect match for your academic goals with ease and confidence.",
    },
    {
      icon: faUserGraduate,
      title: "Personalized Recommendations",
      description:
        "Receive tailored suggestions based on your interests, goals, and qualifications. Our intelligent algorithm ensures you discover the opportunities best suited to your profile.",
    },
    {
      icon: faSearch,
      title: "Advanced Search & Filters",
      description:
        "Easily find institutes, scholarships, and programs that match your preferences. Use filters like tuition fees, program duration, location, and more for a seamless experience.",
    },
    {
      icon: faHandsHelping,
      title: "Career Counseling",
      description:
        "The RAG-powered counseling service offers personalized academic and career guidance by providing tailored advice based on student goals, helping align their educational journey with career aspirations.",
    },
    {
      icon: faPencilAlt,
      title: "Entry Test Preparation",
      description:
        "Get resources and expert guidance to prepare for entrance exams. Access study materials, practice tests, and tips to improve your chances of success in securing a spot at your desired institution.",
    },    
    {
      icon: faVrCardboard,
      title: "Virtual Campus Tours",
      description:
        "Explore institutes virtually and experience campus life from the comfort of your home. Get a realistic view of campuses, facilities, and student life to make informed decisions.",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <motion.header 
        className="bg-[#538be6] text-white py-36 px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Features</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Discover how GlobalApply simplifies your academic application journey with its comprehensive features.
        </p>
      </motion.header>

      {/* Features List */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-[#1D5EC7] text-white rounded-full p-4 mb-6">
                <FontAwesomeIcon icon={feature.icon} size="2x" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h2>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Description Section */}
      <motion.section 
        className="bg-gray-100 py-16 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Why Choose GlobalApply?</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            GlobalApply is designed to be your ultimate academic companion. From discovering top institutes to securing scholarships and exploring virtual campuses, our platform is built to empower students every step of the way. We leverage advanced technology, expert guidance, and personalized recommendations to ensure your journey is smooth and successful. 
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Whether you're looking for guidance in choosing a career path, assistance in finding the perfect institute, or exploring funding opportunities, GlobalApply has you covered. Join thousands of students worldwide who trust us to turn their academic dreams into reality.
          </p>
        </div>
      </motion.section>

      {/* Interactive Feature Demo */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Experience Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <img src="https://cdn.eso.org/images/screen/ann11053a.jpg" alt="Virtual Campus Tour Demo" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Virtual Campus Tour</h3>
                <p className="text-gray-600 mb-4">Experience our cutting-edge virtual campus tour feature. Explore facilities, classrooms, and campus life from the comfort of your home.</p>
                <Link to='/institutes/detail' className="text-[#1D5EC7] font-semibold flex items-center">
                  Try Demo <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <img src="https://csinpakistan.wordpress.com/wp-content/uploads/2015/07/universities-logo.jpg" alt="Personalized Recommendations Demo" className="w-full h-64 object-contain" />
              <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Explore All Institutes</h3>
              <p className="text-gray-600 mb-4">Discover a variety of institutes and programs tailored to your needs. Our AI-powered system gathers all the available institutes in one place, making it easier for you to find the perfect match.</p>
                <Link to="/institutes" className="text-[#1D5EC7] font-semibold flex items-center">
                  Try Demo <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <motion.section 
        className="py-16 px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Link
          to="/login"
          className="bg-[#1D5EC7] text-white px-12 py-4 rounded-full text-lg shadow-md hover:bg-[#306fd6] transition-all inline-block"
        >
          Get Started with GlobalApply
        </Link>
      </motion.section>
    </div>
  );
};

export default Features;

