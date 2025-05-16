import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList, faMapMarkerAlt, faRupeeSign, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const InstitutesList = ({ institutes, isLoading, error }) => {
  const [isGridView, setIsGridView] = useState(true);

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (institutes.length === 0 && !isLoading) {
    return <p className="text-center text-gray-600 mt-10">No institutes found.</p>;
  }

  return (
    <div>
      {/* View Toggle Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <button
          className={`text-lg ${isGridView ? 'text-[#1d5ec7]' : 'text-gray-600'}`}
          onClick={() => setIsGridView(true)}
          aria-label="Grid View"
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button
          className={`text-lg ${!isGridView ? 'text-[#1d5ec7]' : 'text-gray-600'}`}
          onClick={() => setIsGridView(false)}
          aria-label="List View"
        >
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>

      {/* Institutes Grid/List View */}
      <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {institutes.map((institute) => (
          <Link
            key={institute._id}
            to={`/institutes/detail/${institute._id}`}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${isGridView ? '' : 'flex'}`}
          >
            {/* Institute Logo */}
            <div className={`${isGridView ? 'p-6' : 'p-4 flex-shrink-0'}`}>
              <img
                src={institute.logo || 'https://via.placeholder.com/100'}
                alt={institute.name}
                className={`${isGridView ? 'w-full h-48 object-contain mb-4' : 'w-24 h-24 object-contain'}`}
              />
            </div>

            {/* Institute Details */}
            <div className={`${isGridView ? 'p-6' : 'p-4 flex-grow'}`}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{institute.name}</h3>

              {/* Location */}
              {institute.location && (
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {institute.location}
                </p>
              )}

              {/* Fee Range */}
              {institute.feeRange && (
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faRupeeSign} className="mr-2" />
                  {institute.feeRange}
                </p>
              )}

              {/* Rating */}
              {typeof institute.rating === 'number' && (
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">{institute.rating.toFixed(1)}</span>
                </div>
              )}

              {/* Popular Courses */}
              {institute.courses?.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Popular Courses:</h4>
                  <ul className="text-sm text-gray-600">
                    {institute.courses.slice(0, 3).map((course, index) => (
                      <li key={index} className="inline-block mr-2">
                        <span className="bg-gray-200 rounded-full px-2 py-1">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InstitutesList;
