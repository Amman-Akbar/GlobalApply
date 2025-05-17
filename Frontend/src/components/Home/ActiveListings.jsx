import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActiveListings = () => {
  const [activePostings, setActivePostings] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postingsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch active institutes
        const response = await axios.get("http://localhost:3000/api/v1/institute/active");
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch active institutes');
        }

        const institutesData = response.data.data;
        console.log('Fetched institutes:', institutesData);

        // Transform the data to get active postings
        const activePostingsData = institutesData.flatMap((institute) => {
          if (!Array.isArray(institute.departments)) {
            console.warn(`No departments found for institute: ${institute.name}`);
            return [];
          }

          return institute.departments.flatMap((department) => {
            if (!Array.isArray(department.programs)) {
              console.warn(`No programs found for department in institute: ${institute.name}`);
              return [];
            }

            return department.programs.map((program) => ({
              id: program._id,
              degree: program.name,
              university: institute.name,
              universityLogo: institute.logo,
              city: institute.location,
              deadline: program.deadline,
              level: program.levelofProgram,
              instituteId: institute._id
            }));
          });
        });

        setActivePostings(activePostingsData);

        // Calculate latest listings
        const degreeCount = activePostingsData.reduce((acc, posting) => {
          acc[posting.degree] = (acc[posting.degree] || 0) + 1;
          return acc;
        }, {});

        const sortedDegreeCount = Object.entries(degreeCount)
          .map(([degree, count]) => ({ degree, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        setLatestListings(sortedDegreeCount);
      } catch (error) {
        console.error("Error fetching active institutes:", error);
        setError(error.message || "Failed to load listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  const indexOfLastPosting = currentPage * postingsPerPage;
  const indexOfFirstPosting = indexOfLastPosting - postingsPerPage;
  const currentPostings = activePostings.slice(indexOfFirstPosting, indexOfLastPosting);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap w-full h-full bg-gray-100 p-6">
      {/* Left Section: Active Postings */}
      <div className="w-full md:w-2/3 p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Admission</h2>
        {activePostings.length === 0 ? (
          <div className="bg-white rounded-md shadow-md p-6 text-center flex-grow">
            <p className="text-gray-600">No active admissions available at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-md shadow-md flex-grow flex flex-col">
            <table className="min-w-full text-left text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">#</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">Degree Name</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">University Name</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">Deadline</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPostings.map((posting, index) => (
                  <tr key={index} className={`border-b last:border-none ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="py-3 px-4 text-sm">{indexOfFirstPosting + index + 1}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="font-medium">{posting.degree}</div>
                      <div className="text-gray-500 text-xs">{posting.level}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        {posting.universityLogo && (
                          <img
                            src={posting.universityLogo}
                            alt={posting.university}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        )}
                        <span>{posting.university}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{posting.deadline}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      <button
                        className="bg-[#1d5ec7] text-white py-2 px-4 rounded-md hover:bg-[#306fd6] transition duration-200"
                        onClick={() => navigate(`/institutes/detail/${posting.instituteId}`)}
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activePostings.length > postingsPerPage && (
              <div className="flex justify-end gap-2 my-4 mx-4 mt-auto">
                <button
                  className="text-black py-2 px-3 rounded-md border border-black transition duration-200 disabled:opacity-50"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  &lt;&lt;
                </button>
                <button
                  className="text-black py-2 px-3 rounded-md border border-black transition duration-200 disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <button
                  className="text-black py-2 px-3 rounded-md border border-black transition duration-200 disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(activePostings.length / postingsPerPage)))}
                  disabled={currentPage === Math.ceil(activePostings.length / postingsPerPage)}
                >
                  &gt;
                </button>
                <button
                  className="text-black py-2 px-3 rounded-md border border-black transition duration-200 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.ceil(activePostings.length / postingsPerPage))}
                  disabled={currentPage === Math.ceil(activePostings.length / postingsPerPage)}
                >
                  &gt;&gt;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Latest Listings */}
      <div className="w-full md:w-1/3 p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest Listings</h2>
        {latestListings.length === 0 ? (
          <div className="bg-white rounded-md shadow-md p-6 text-center flex-grow">
            <p className="text-gray-600">No latest listings available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-md p-4 shadow-md flex-grow flex flex-col">
            <ul className="flex-grow">
              {latestListings.map((listing, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-3 border-b last:border-none cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/institutes')}
                >
                  <div>
                    <span className="text-gray-800 font-medium">{listing.degree}</span>
                    <p className="text-sm text-gray-600">
                      {listing.count} active program{listing.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-gray-600">{listing.count} Listings</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveListings;
