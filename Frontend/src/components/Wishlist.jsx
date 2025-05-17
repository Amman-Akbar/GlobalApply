import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMapMarkerAlt, faGraduationCap, faRupeeSign, faClock, faUser, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      let url = 'http://localhost:3000/api/v1/wishlist';
      
      if (user.role === 'admin') {
        url = `${url}`; // Admin gets all wishlists
      } else if (user.role === 'institute') {
        url = `${url}/institute/${user.id}`;
      } else if (user.role === 'student') {
        url = `${url}/user/${user.id}`;
      }
      
      const response = await axios.get(url);
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (instituteId, programId) => {
    try {
      await axios.delete('http://localhost:3000/api/v1/wishlist/remove', {
        data: {
          userId: user.id,
          instituteId,
          programId
        }
      });
      
      setWishlist(prev => prev.filter(item => 
        !(item.instituteId._id === instituteId && item.programId === programId)
      ));
      
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Filter wishlist based on search query
  const filteredWishlist = wishlist.filter((item) => {
    const searchString = `${item.instituteId.name} ${item.programDetails?.name} ${item.programDetails?.department} ${item.userId?.name || ''} ${item.userId?.email || ''}`
      .toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        {user.role === 'admin' ? 'All Wishlists' : 
         user.role === 'institute' ? 'Students Who Added Your Programs' : 
         'Your Wishlist'}
      </h3>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            user.role === 'admin' ? "Search by institute, program, or student..." :
            user.role === 'institute' ? "Search by student name or program..." :
            "Search by institute name or program..."
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filteredWishlist.length === 0 ? (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faHeart} className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">
            {user.role === 'admin' ? 'No wishlists found' :
             user.role === 'institute' ? 'No students have added your programs to their wishlist' :
             'Your wishlist is currently empty'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {(user.role === 'admin' || user.role === 'institute') && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institute
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee/Semester
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={`${item.instituteId._id}-${item.programId}`} className="hover:bg-gray-50">
                    {(user.role === 'admin' || user.role === 'institute') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUser} className="text-[#1D5EC7] w-4 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.userId?.name}</div>
                            <div className="text-sm text-gray-500">{item.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={item.instituteId.image} 
                          alt={item.instituteId.name}
                          className="h-8 w-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.instituteId.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#1D5EC7] w-3 mr-1" />
                            {item.instituteId.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.programDetails?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.programDetails?.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRupeeSign} className="text-[#1D5EC7] w-4 mr-1" />
                        {item.programDetails?.semesterFee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-[#1D5EC7] w-4 mr-1" />
                        {item.programDetails?.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-[#1D5EC7] w-4 mr-1" />
                        {item.programDetails?.levelofProgram}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => window.location.href = `/institutes/detail/${item.instituteId._id}`}
                          className="text-[#1D5EC7] hover:text-[#306fd6] transition duration-300"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4" />
                        </button>
                        {user.role === 'student' && (
                          <button
                            onClick={() => removeFromWishlist(item.instituteId._id, item.programId)}
                            className="text-red-500 hover:text-red-700 transition duration-300"
                            title="Remove from Wishlist"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4" />
                    </button>
                        )}
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Wishlist;
