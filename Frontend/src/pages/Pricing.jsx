import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faRupee, faUsers, faCogs } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      icon: faRupee,
      price: "Free",
      description: "Get started with no costs. Perfect for individuals and small institutes.",
      features: [
        "Access to basic features",
        "Limited student recommendations",
        "Community support"
      ]
    },
    {
      name: "Premium",
      icon: faUsers,
      price: "Rs 9,999/month",
      description: "Advanced features for growing institutes. Includes premium support.",
      features: [
        "Unlimited student recommendations",
        "Priority customer support",
        "Access to virtual campus tours"
      ]
    },
    {
      name: "Enterprise",
      icon: faCogs,
      price: "Rs 29,999/month",
      description: "Tailored solutions for large institutions with dedicated support and custom features.",
      features: [
        "Custom integrations",
        "Dedicated account manager",
        "24/7 support"
      ]
    }
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Explore our flexible pricing options tailored to meet the needs of your institution.
        </p>
      </motion.header>

      {/* Call-to-Action Section */}
      <motion.section
        className="py-16 px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <p className="text-lg text-gray-700 mb-6">
          If you're a student, you can enjoy our platform for free! Explore top institutes, access personalized recommendations, and more without any cost.
        </p>
        <Link
          to="/login"
          className="bg-[#1D5EC7] text-white px-12 py-4 rounded-full text-lg shadow-md hover:bg-[#6b41cc] transition-all inline-block"
        >
          Get Started as a Student
        </Link>
      </motion.section>

      {/* Pricing Plans Section */}
      <section className=" px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-[#1D5EC7] text-white rounded-full p-4 mb-6">
                <FontAwesomeIcon icon={plan.icon} size="2x" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-2xl font-semibold text-gray-800 mb-6">{plan.price}</p>

              <ul className="text-gray-600 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/institutes/signup"
                className="bg-[#1D5EC7] text-white px-12 py-4 rounded-full text-lg shadow-md hover:bg-[#6b41cc] transition-all inline-block"
              >
                Choose Plan
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-10">Compare the Features</h2>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-[#1D5EC7] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Feature</th>
                  <th className="px-6 py-3 text-left">Free</th>
                  <th className="px-6 py-3 text-left">Premium</th>
                  <th className="px-6 py-3 text-left">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4">Access to Basic Features</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Unlimited Student Recommendations</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Priority Support</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Virtual Campus Tours</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Custom Integrations</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Dedicated Account Manager</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">24/7 Support</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-red-500">✘</td>
                  <td className="px-6 py-4 text-green-500">✔</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;
