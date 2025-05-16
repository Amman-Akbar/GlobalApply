import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  // Sample data for institutes in the wishlist
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Riphah International University', program: 'Computer Science', location: 'Islamabad, Pakistan', image: 'https://tutoria.pk/blog/wp-content/uploads/2021/01/Everything-to-Know-About-Ripah-International-University-Islamabad-2.jpg' },
    { id: 2, name: 'LUMS', program: 'Business Administration', location: 'Lahore, Pakistan', image: 'https://i.tribune.com.pk/media/images/96148-lumsjpg-1588936166/96148-lumsjpg-1588936166.jpg' },
    { id: 3, name: 'NUST', program: 'Mechanical Engineering', location: 'Islamabad, Pakistan', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuNh-7OocISNptqZF-v_g3nCW4tJlSBbHQTA&s' },
  ]);

  // Function to remove an institute from the wishlist
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((institute) => institute.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Wishlist</h3>
      <p className="text-gray-600 mb-6">Here are the institutes you've added to your wishlist. You can explore more or remove them anytime.</p>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is currently empty. Start adding institutes!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((institute) => (
            <div key={institute.id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img src={institute.image} alt={institute.name} className="w-full h-32 object-cover mb-4 rounded" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{institute.name}</h4>
              <p className="text-gray-600 mb-2">{institute.program}</p>
              <p className="text-gray-500 text-sm mb-4">{institute.location}</p>
              <div className="flex justify-between items-center">
                <Link to={`/institutes/${institute.id}`} className="text-[#1D5EC7] font-semibold hover:text-[#306fd6]">View Details</Link>
                <button onClick={() => removeFromWishlist(institute.id)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
