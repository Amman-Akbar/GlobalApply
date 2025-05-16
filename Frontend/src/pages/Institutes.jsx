import React, { useState, useCallback, useEffect } from "react";
import Filter from "../components/Institutes/Filter";
import InstitutesList from "../components/Institutes/InstitutesList";
import axios from "axios";

const Institutes = () => {
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/institute");
        const institutesData = response.data.data || [];

        setAllInstitutes(institutesData);
        setFilteredInstitutes(institutesData);
      } catch (error) {
        console.error("Error fetching institutes:", error);
        setError("Failed to fetch institutes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  const handleFilter = useCallback(
    (filters) => {
      let filtered = [...allInstitutes]; // Copy original list
  
      // Search by name or course
      if (filters.searchTerm) {
        filtered = filtered.filter(
          (inst) =>
            inst.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            inst.departments.some((dept) =>
              dept.programs.some((program) =>
                program.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
              )
            )
        );
      }
  
      // Budget Filtering (Handling PKR string)
      if (filters.budget) {
        filtered = filtered.filter((inst) => {
          const [min, max] = inst.feeRange
            .replace(/[PKR,]/g, "") // Remove currency symbols
            .split(" - ")
            .map(Number);
          
          if (filters.budget === "low") return max < 100000;
          if (filters.budget === "medium") return min >= 100000 && max <= 200000;
          if (filters.budget === "high") return min > 200000;
          return true;
        });
      }
  
      // Location Filtering
      if (filters.location) {
        filtered = filtered.filter((inst) =>
          inst.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
  
      // Rating Filtering
      if (filters.rating) {
        filtered = filtered.filter((inst) => inst.rating >= Number(filters.rating));
      }
  
      // Update state
      setFilteredInstitutes(filtered);
      setPage(1);
    },
    [allInstitutes]
  );
  

  const loadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const displayedInstitutes = filteredInstitutes.slice(0, page * itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#538be6] py-20">
        <h1 className="text-white pt-12 text-center text-4xl md:text-5xl font-bold">
          Find Your Perfect Institutes
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Filter onFilter={handleFilter} />
          </div>
          <div className="lg:w-3/4">
            <InstitutesList institutes={displayedInstitutes} />
            {displayedInstitutes.length < filteredInstitutes.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-[#1d5ec7] text-white rounded-lg text-sm font-medium hover:bg-[#306fd6] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
            {filteredInstitutes.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No results found. Try adjusting your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Institutes;
