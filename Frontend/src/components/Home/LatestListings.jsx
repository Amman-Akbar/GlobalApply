import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LatestListings = () => {
  const navigate = useNavigate();
  const [latestListings, setLatestListings] = useState({});
  const [selectedTab, setSelectedTab] = useState("Undergraduate"); // Default Tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestListings = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/institute/latest-listings");

        if (!response.data.success || typeof response.data.data !== "object") {
          setError("No listings available.");
          setLoading(false);
          return;
        }

        setLatestListings(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching latest listings:", error);
        setError("Failed to fetch latest listings. Please try again later.");
        setLoading(false);
      }
    };

    fetchLatestListings();
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

  const tabs = Object.keys(latestListings);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Featured Institute Listings
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                selectedTab === tab
                  ? "bg-[#1d5ec7] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestListings[selectedTab]?.length > 0 ? (
            latestListings[selectedTab].map((listing, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <img
                    src={listing.logo || "/placeholder.svg"}
                    alt={listing.university}
                    className="w-16 h-16 object-contain rounded-full mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.program}</h3>
                  <p className="text-sm text-indigo-600 font-bold">{listing.university}</p>
                  <p className="text-sm text-gray-600">{listing.city}</p>
                  <p className="text-sm text-gray-600">Deadline: {listing.deadline}</p>
                  <button
                    className="text-white bg-[#1d5ec7] px-4 py-2 rounded mt-4"
                    onClick={() => navigate(`/institutes/detail/${listing._id}`)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-4">
              No listings available for {selectedTab}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
