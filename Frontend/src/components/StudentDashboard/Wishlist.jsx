import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMapMarkerAlt, faGraduationCap, faRupeeSign, faClock } from '@fortawesome/free-solid-svg-icons';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/wishlist/user/${user.id}`);
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
      
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Wishlist</h3>
      <p className="text-gray-600 mb-6">Here are the programs you've added to your wishlist. You can explore more or remove them anytime.</p>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faHeart} className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Your wishlist is currently empty</p>
          <Link 
            to="/institutes" 
            className="inline-block mt-4 text-[#1D5EC7] hover:text-[#306fd6] font-semibold"
          >
            Browse Institutes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div 
              key={`${item.instituteId._id}-${item.programId}`} 
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
            >
              <div className="relative h-48">
                <img 
                  src={item.instituteId.image} 
                  alt={item.instituteId.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h4 className="text-lg font-semibold text-white">
                    {item.instituteId.name}
                  </h4>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">
                      {item.programDetails?.name}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {item.programDetails?.department}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-600 flex items-center text-sm">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-[#1D5EC7] w-4" />
                      {item.instituteId.location}
                    </p>
                    <p className="text-gray-600 flex items-center text-sm">
                      <FontAwesomeIcon icon={faRupeeSign} className="mr-2 text-[#1D5EC7] w-4" />
                      {item.programDetails?.semesterFee}/semester
                    </p>
                    <p className="text-gray-600 flex items-center text-sm">
                      <FontAwesomeIcon icon={faClock} className="mr-2 text-[#1D5EC7] w-4" />
                      {item.programDetails?.duration}
                    </p>
                    <p className="text-gray-600 flex items-center text-sm">
                      <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-[#1D5EC7] w-4" />
                      {item.programDetails?.levelofProgram}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <Link 
                    to={`/institutes/detail/${item.instituteId._id}`}
                    className="text-[#1D5EC7] font-semibold hover:text-[#306fd6] transition duration-300"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(item.instituteId._id, item.programId)}
                    className="text-red-500 hover:text-red-700 font-semibold transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { Wishlist };
export default Wishlist;
