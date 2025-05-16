import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    planName: '',
    price: '',
    features: '',
    status: 'Active'
  });
  const [viewMode, setViewMode] = useState('plans'); // 'plans' or 'institutes'
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchInstitutes();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/v1/subscriptions');
      setSubscriptions(response.data);
    } catch (err) {
      setError('Failed to fetch subscriptions. Please try again later.');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/v1/institute');
      setInstitutes(response.data.data);
    } catch (err) {
      setError('Failed to fetch institutes. Please try again later.');
      console.error('Error fetching institutes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const subscriptionData = {
        ...newSubscription,
        features: newSubscription.features.split(',').map(f => f.trim())
      };
      await axios.post('http://localhost:3000/api/v1/subscriptions', subscriptionData);
      setShowAddModal(false);
      setNewSubscription({ planName: '', price: '', features: '', status: 'Active' });
      fetchSubscriptions();
    } catch (err) {
      setError('Failed to add subscription. Please try again.');
      console.error('Error adding subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(
        `http://localhost:3000/api/v1/subscriptions/${selectedSubscription._id}`,
        selectedSubscription
      );
      setSubscriptions(subscriptions.map(sub => 
        sub._id === selectedSubscription._id ? response.data : sub
      ));
      setSelectedSubscription(null);
    } catch (err) {
      setError('Failed to update subscription. Please try again.');
      console.error('Error updating subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.delete(`http://localhost:3000/api/v1/subscriptions/${id}`);
      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
    } catch (err) {
      setError('Failed to delete subscription. Please try again.');
      console.error('Error deleting subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubscription = async (instituteId, subscriptionId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('http://localhost:3000/api/v1/subscriptions/assign', {
        subscriptionId,
        instituteId
      });
      fetchInstitutes();
      setSelectedInstitute(null);
    } catch (err) {
      setError('Failed to assign subscription. Please try again.');
      console.error('Error assigning subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubscription = async (instituteId, subscriptionId) => {
    if (!window.confirm('Are you sure you want to remove this subscription?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.post('http://localhost:3000/api/v1/subscriptions/remove', {
        subscriptionId,
        instituteId
      });
      fetchInstitutes();
      setSelectedInstitute(null);
    } catch (err) {
      setError('Failed to remove subscription. Please try again.');
      console.error('Error removing subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionStatus = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(`http://localhost:3000/api/v1/subscriptions/${id}/toggle-status`);
      setSubscriptions(subscriptions.map(sub => 
        sub._id === id ? response.data : sub
      ));
    } catch (err) {
      setError('Failed to toggle subscription status. Please try again.');
      console.error('Error toggling subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    subscription.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subscribedInstitutes = institutes.filter(institute => institute.subscription);
  const unsubscribedInstitutes = institutes.filter(institute => !institute.subscription);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* View Toggle */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('plans')}
            className={`px-4 py-2 rounded ${
              viewMode === 'plans'
                ? 'bg-[#1D5EC7] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setViewMode('institutes')}
            className={`px-4 py-2 rounded ${
              viewMode === 'institutes'
                ? 'bg-[#1D5EC7] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Institute Subscriptions
          </button>
        </div>
        {viewMode === 'plans' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Plan
          </button>
        )}
      </div>

      {viewMode === 'plans' ? (
        <>
          {/* Search Section */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by plan name..."
              className="border rounded p-2 w-full lg:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Subscriptions Table */}
          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Subscription Plans</h3>
            {loading ? (
              <div className="text-center py-4">Loading subscriptions...</div>
            ) : (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Plan Name</th>
                    <th className="border border-gray-300 p-2">Price</th>
                    <th className="border border-gray-300 p-2">Features</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Institutes</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((subscription) => (
                      <tr key={subscription._id} className="text-center">
                        <td className="border border-gray-300 p-2">{subscription.planName}</td>
                        <td className="border border-gray-300 p-2">{subscription.price}</td>
                        <td className="border border-gray-300 p-2">
                          <ul className="list-disc list-inside">
                            {subscription.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="border border-gray-300 p-2">{subscription.status}</td>
                        <td className="border border-gray-300 p-2">{subscription.institutes}</td>
                        <td className="border border-gray-300 p-2 flex flex-col sm:flex-row justify-center gap-2">
                          <button
                            onClick={() => toggleSubscriptionStatus(subscription._id)}
                            disabled={loading}
                            className={`px-3 py-1 rounded ${
                              subscription.status === 'Active'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            } disabled:opacity-50`}
                          >
                            {subscription.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => setSelectedSubscription(subscription)}
                            disabled={loading}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubscription(subscription._id)}
                            disabled={loading}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="border border-gray-300 p-4 text-center text-gray-500"
                      >
                        No subscriptions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Institute Subscriptions View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscribed Institutes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Subscribed Institutes</h3>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {subscribedInstitutes.map((institute) => (
                    <div
                      key={institute._id}
                      className="border rounded p-4 hover:shadow-md transition duration-300"
                    >
                      <h4 className="font-semibold">{institute.username}</h4>
                      <p className="text-sm text-gray-600">{institute.email}</p>
                      <p className="text-sm mt-2">
                        Plan: <span className="font-semibold">{institute.subscription?.planName}</span>
                      </p>
                      <p className="text-sm">
                        Price: <span className="font-semibold">{institute.subscription?.price}</span>
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => setSelectedInstitute(institute)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Change Plan
                        </button>
                        <button
                          onClick={() => handleRemoveSubscription(institute._id, institute.subscription._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {subscribedInstitutes.length === 0 && (
                    <p className="text-gray-500 text-center">No subscribed institutes found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Unsubscribed Institutes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Unsubscribed Institutes</h3>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {unsubscribedInstitutes.map((institute) => (
                    <div
                      key={institute._id}
                      className="border rounded p-4 hover:shadow-md transition duration-300"
                    >
                      <h4 className="font-semibold">{institute.username}</h4>
                      <p className="text-sm text-gray-600">{institute.email}</p>
                      <p className="text-sm mt-2 text-red-500">No active subscription</p>
                      <button
                        onClick={() => setSelectedInstitute(institute)}
                        className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Assign Plan
                      </button>
                    </div>
                  ))}
                  {unsubscribedInstitutes.length === 0 && (
                    <p className="text-gray-500 text-center">All institutes are subscribed.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Subscription Plan</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSubscription();
              }}
            >
              <label className="block mb-2 font-semibold">Plan Name</label>
              <input
                type="text"
                className="border rounded p-2 w-full mb-4"
                value={newSubscription.planName}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    planName: e.target.value,
                  })
                }
                required
              />
              <label className="block mb-2 font-semibold">Price</label>
              <input
                type="text"
                className="border rounded p-2 w-full mb-4"
                value={newSubscription.price}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    price: e.target.value,
                  })
                }
                required
              />
              <label className="block mb-2 font-semibold">Features (comma-separated)</label>
              <textarea
                className="border rounded p-2 w-full mb-4"
                value={newSubscription.features}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    features: e.target.value,
                  })
                }
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subscription Modal */}
      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Subscription Plan</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSubscription();
              }}
            >
              <label className="block mb-2 font-semibold">Plan Name</label>
              <input
                type="text"
                className="border rounded p-2 w-full mb-4"
                value={selectedSubscription.planName}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    planName: e.target.value,
                  })
                }
                required
              />
              <label className="block mb-2 font-semibold">Price</label>
              <input
                type="text"
                className="border rounded p-2 w-full mb-4"
                value={selectedSubscription.price}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    price: e.target.value,
                  })
                }
                required
              />
              <label className="block mb-2 font-semibold">Features (comma-separated)</label>
              <textarea
                className="border rounded p-2 w-full mb-4"
                value={selectedSubscription.features.join(', ')}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    features: e.target.value.split(',').map((f) => f.trim()),
                  })
                }
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubscription(null)}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign/Change Subscription Modal */}
      {selectedInstitute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h3 className="text-lg font-semibold mb-4">
              {selectedInstitute.subscription ? 'Change Subscription Plan' : 'Assign Subscription Plan'}
            </h3>
            <div className="space-y-4">
              {subscriptions
                .filter(sub => sub.status === 'Active')
                .map((subscription) => (
                  <div
                    key={subscription._id}
                    className="border rounded p-4 hover:shadow-md transition duration-300"
                  >
                    <h4 className="font-semibold">{subscription.planName}</h4>
                    <p className="text-sm text-gray-600">{subscription.price}</p>
                    <ul className="mt-2 text-sm text-gray-600">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleAssignSubscription(selectedInstitute._id, subscription._id)}
                      disabled={loading || selectedInstitute.subscription?._id === subscription._id}
                      className={`mt-4 w-full py-2 px-4 rounded text-white ${
                        selectedInstitute.subscription?._id === subscription._id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#1D5EC7] hover:bg-[#306fd6]'
                      }`}
                    >
                      {selectedInstitute.subscription?._id === subscription._id
                        ? 'Current Plan'
                        : 'Select Plan'}
                    </button>
                  </div>
                ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => setSelectedInstitute(null)}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
