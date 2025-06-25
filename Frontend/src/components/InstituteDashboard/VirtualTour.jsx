import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VirtualTours = ({ instituteId }) => {
  const [tours, setTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  // Fetch current subscription plan and status for the institute
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!instituteId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/institute/${instituteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const institute = response.data.data;
        if (institute && institute.subscription) {
          setSubscriptionStatus(institute.subscriptionStatus || null);
          // Fetch all subscriptions to get planName
          const subsRes = await axios.get('http://localhost:3000/api/v1/subscriptions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const plan = subsRes.data.find(sub => sub._id === institute.subscription);
          setSubscriptionPlan(plan ? plan.planName : null);
        } else {
          setSubscriptionPlan(null);
          setSubscriptionStatus(institute?.subscriptionStatus || null);
        }
      } catch (err) {
        setSubscriptionPlan(null);
        setSubscriptionStatus(null);
      }
    };
    fetchSubscription();
  }, [instituteId]);

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

  // Blur if no plan, free plan, or pending status
  const shouldRestrict = !subscriptionPlan || (subscriptionPlan && subscriptionPlan.toLowerCase() === 'free') || subscriptionStatus === 'pending';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Virtual Tours</h2>
      <p className="text-gray-600">
        Manage and explore virtual tours to showcase your institute's facilities and features.
      </p>

      {shouldRestrict ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-center">
          Upgrade your plan to get access to virtual tours.
        </div>
      ) : (
        <>
          {/* Add New Tour Button */}
          <button
            onClick={handleAddTour}
            className="bg-[#1D5EC7] text-white py-2 px-4 rounded-lg hover:bg-[#306fd6] transition duration-300"
          >
            Add New Tour
          </button>

          {/* Tours List */}
          {tours.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>No virtual tours available. Click "Add New Tour" to get started!</p>
            </div>
          ) : (
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
          )}
        </>
      )}

      {/* Edit Tour Modal */}
      {editingTour && !shouldRestrict && (
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
