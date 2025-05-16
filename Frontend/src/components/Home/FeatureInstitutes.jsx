import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FeatureInstitutes = () => {
  const navigate = useNavigate();
  const [featuredInstitutes, setFeaturedInstitutes] = useState({
    Lahore: [],
    Karachi: [],
    Islamabad: [],
    All: [],
  });
  const [selectedTab, setSelectedTab] = useState("All"); // Default to "All"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedInstitutes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/institute/featured");

        // console.log("API Response:", response.data.data);  Debugging line

        if (!response.data.success || typeof response.data.data !== "object") {
          setError("No featured institutes available.");
          setLoading(false);
          return;
        }

        const updatedInstitutes = { ...featuredInstitutes, ...response.data.data };

        // Generate 4 random institutes for the "All" tab
        const allInstitutes = Object.values(response.data.data).flat();
        updatedInstitutes.All = allInstitutes.sort(() => 0.5 - Math.random()).slice(0, 4);

        setFeaturedInstitutes(updatedInstitutes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured institutes:", error);
        setError("Failed to fetch featured institutes. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeaturedInstitutes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  const tabs = ["All", "Lahore", "Karachi", "Islamabad"]; // 🔹 Fixed: Added "All" tab

  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Featured Institutes
        </h2>

        {/* Tabs for cities */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((city) => (
            <button
              key={city}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                selectedTab === city
                  ? "bg-[#1d5ec7] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab(city)}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Display institutes based on selected tab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredInstitutes[selectedTab]?.length > 0 ? (
            featuredInstitutes[selectedTab].map((institute, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/institutes/detail/${institute._id}`)}
              >
                <img
                  src={institute.logo || "/placeholder.svg"}
                  alt={institute.name}
                  className="w-full h-48 object-contain p-4"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {institute.name}
                  </h3>
                  <p className="text-sm text-gray-600">{institute.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-4">
              No featured institutes in {selectedTab} yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeatureInstitutes;
