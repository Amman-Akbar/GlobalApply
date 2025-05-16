import React, { useState } from 'react';

// Sample data for virtual tours
const sampleTours = [
  {
    id: 1,
    title: 'Campus Tour',
    description: 'Explore our campus with a detailed virtual tour showcasing classrooms, labs, and amenities.',
    thumbnail: 'https://via.placeholder.com/300x200', // Replace with actual thumbnail URLs
  },
  {
    id: 2,
    title: 'Library Tour',
    description: 'Take a look at our state-of-the-art library, equipped with modern facilities and vast resources.',
    thumbnail: 'https://via.placeholder.com/300x200', // Replace with actual thumbnail URLs
  },
  {
    id: 3,
    title: 'Sports Facilities',
    description: 'Discover our extensive sports facilities, including fields, courts, and gymnasiums.',
    thumbnail: 'https://via.placeholder.com/300x200', // Replace with actual thumbnail URLs
  },
];

const VirtualTours = () => {
  const [tours, setTours] = useState(sampleTours);
  const [editingTour, setEditingTour] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');

  // Function to delete a tour
  const handleDelete = (id) => {
    const updatedTours = tours.filter((tour) => tour.id !== id);
    setTours(updatedTours);
  };

  // Function to add a new tour
  const handleAddTour = () => {
    const newTour = {
      id: tours.length + 1,
      title: 'New Virtual Tour',
      description: 'This is a placeholder description for the new tour.',
      thumbnail: 'https://via.placeholder.com/300x200',
    };
    setTours([...tours, newTour]);
  };

  // Function to edit a tour
  const handleEditTour = (tour) => {
    setEditingTour(tour.id);
    setUpdatedTitle(tour.title);
    setUpdatedDescription(tour.description);
  };

  // Function to save the edited tour
  const handleSaveEdit = (id) => {
    const updatedTours = tours.map((tour) =>
      tour.id === id
        ? { ...tour, title: updatedTitle, description: updatedDescription }
        : tour
    );
    setTours(updatedTours);
    setEditingTour(null);
    setUpdatedTitle('');
    setUpdatedDescription('');
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingTour(null);
    setUpdatedTitle('');
    setUpdatedDescription('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Virtual Tours</h2>
      <p className="text-gray-600">
        Manage and explore virtual tours to showcase your institute's facilities and features.
      </p>

      {/* Add New Tour Button */}
      <button
        onClick={handleAddTour}
        className="bg-[#1D5EC7] text-white py-2 px-4 rounded-lg hover:bg-[#306fd6] transition duration-300"
      >
        Add New Tour
      </button>

      {/* Tours List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={tour.thumbnail}
                alt={tour.title}
                className="w-full h-40 object-cover"
              />
            </div>

            {/* Tour Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{tour.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{tour.description}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center px-4 pb-4">
              <button
                onClick={() => handleEditTour(tour)}
                className="text-sm text-[#1D5EC7] hover:text-[#306fd6] transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tour.id)}
                className="text-sm text-red-600 hover:text-red-800 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tours.length === 0 && (
        <div className="text-center text-gray-600">
          <p>No virtual tours available. Click "Add New Tour" to get started!</p>
        </div>
      )}

      {/* Edit Tour Modal */}
      {editingTour && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Tour</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-700">Title</label>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-700">Description</label>
              <textarea
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingTour)}
                className="bg-[#1D5EC7] text-white py-2 px-4 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTours;
