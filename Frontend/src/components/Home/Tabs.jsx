import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Tabs = () => {
  const [institutesData, setInstitutesData] = useState({});
  const [selectedTab, setSelectedTab] = useState('computer-science');
  const navigate = useNavigate();

  const tabs = [
    { id: 'computer-science', label: 'Computer Science' },
    { id: 'medical', label: 'Medical' },
    { id: 'electrical', label: 'Electrical' },
  ];

  useEffect(() => {
    const fetchTrendingInstitutes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/institute/trending");
        // Assuming the response data structure is:
        // { data: { 'computer-science': [...], medical: [...], ... } }
        setInstitutesData(response.data.data);
      } catch (error) {
        console.error("Error fetching trending institutes:", error);
      }
    };

    fetchTrendingInstitutes();
  }, []);

  // If data is not loaded for the selected tab, fallback to an empty array.
  const tabContent = institutesData[selectedTab] || [];

  return (
    <section className="pb-10 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Trending Fields</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-[#1d5ec7] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tabContent.map((institute, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/institutes/detail/${institute._id}`)}
            >
              <img
                src={institute.logo || "/placeholder.svg?height=100&width=100"}
                alt={institute.name}
                className="w-full h-48 object-contain"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{institute.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{institute.location}</p>
                <p className="text-sm font-medium text-[#8C52FF]">{institute.feeRange}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tabs;
