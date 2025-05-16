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
  const [currentPage, setCurrentPage] = useState({
    pending: 1,
    active: 1,
    unsubscribed: 1
  });
  const cardsPerPage = 4;
  const [selectedInstituteDetails, setSelectedInstituteDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
      console.log('Institutes data:', response.data.data); // Debug log
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

  const handleApproveSubscription = async (instituteId, subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      if (!subscriptionId) {
        throw new Error('Invalid subscription ID');
      }

      await axios.post('http://localhost:3000/api/v1/subscriptions/approve', {
        subscriptionId,
        instituteId
      });
      
      fetchInstitutes();
    } catch (err) {
      setError('Failed to approve subscription. Please try again.');
      console.error('Error approving subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubscription = async (instituteId, subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      if (!subscriptionId) {
        throw new Error('Invalid subscription ID');
      }

      await axios.post('http://localhost:3000/api/v1/subscriptions/reject', {
        subscriptionId,
        instituteId
      });
      
      fetchInstitutes();
    } catch (err) {
      setError('Failed to reject subscription. Please try again.');
      console.error('Error rejecting subscription:', err);
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

  const subscribedInstitutes = institutes.filter(institute => 
    institute.subscription && institute.subscriptionStatus === 'active'
  );
  
  const pendingInstitutes = institutes.filter(institute => 
    institute.subscription && institute.subscriptionStatus === 'pending'
  );
  
  const unsubscribedInstitutes = institutes.filter(institute => 
    !institute.subscription || institute.subscriptionStatus === 'rejected'
  );

  const paginateInstitutes = (institutes, type) => {
    const startIndex = (currentPage[type] - 1) * cardsPerPage;
    return institutes.slice(startIndex, startIndex + cardsPerPage);
  };

  const totalPages = (institutes, type) => Math.ceil(institutes.length / cardsPerPage);

  const handlePageChange = (type, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [type]: page
    }));
  };

  const handleViewDetails = (institute) => {
    setSelectedInstituteDetails(institute);
    setShowDetailsModal(true);
  };

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
          <div className="grid grid-cols-1 gap-8">
            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Pending Approvals</h3>
                  <span className="bg-white text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingInstitutes.length} Pending
                  </span>
                </div>
              </div>
              <div className="p-6">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {paginateInstitutes(pendingInstitutes, 'pending').map((institute) => (
                        <div key={institute._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 truncate">{institute.name}</h4>
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap ml-2">Pending</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 truncate">{institute.email}</p>
                          {institute.subscription && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-grow">
                              <p className="font-medium text-gray-800 truncate">Plan: {institute.subscription.planName || 'N/A'}</p>
                              <p className="text-sm text-gray-600">Price: ${institute.subscription.price || '0'}</p>
                            </div>
                          )}
                          <div className="flex space-x-2 mt-auto">
                            <button
                              onClick={() => handleApproveSubscription(institute._id, institute.subscription?._id)}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectSubscription(institute._id, institute.subscription?._id)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                          <button
                            onClick={() => handleViewDetails(institute)}
                            className="w-full bg-gray-100 text-gray-700 mt-4 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium mb-2"
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                    {totalPages(pendingInstitutes, 'pending') > 1 && (
                      <div className="mt-6 flex justify-center space-x-2">
                        {Array.from({ length: totalPages(pendingInstitutes, 'pending') }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange('pending', i + 1)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage.pending === i + 1
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Active Subscriptions</h3>
                  <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {subscribedInstitutes.length} Active
                  </span>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {paginateInstitutes(subscribedInstitutes, 'active').map((institute) => (
                        <div key={institute._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 truncate">{institute.name}</h4>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap ml-2">Active</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 truncate">{institute.email}</p>
                          {institute.subscription && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-grow">
                              <p className="font-medium text-gray-800 truncate">Plan: {institute.subscription.planName || 'N/A'}</p>
                              <p className="text-sm text-gray-600">Price: ${institute.subscription.price || '0'}</p>
                            </div>
                          )}
                          <div className="flex space-x-2 mt-auto">
                        <button
                          onClick={() => setSelectedInstitute(institute)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Change Plan
                        </button>
                        <button
                          onClick={() => handleRemoveSubscription(institute._id, institute.subscription._id)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                          <button
                            onClick={() => handleViewDetails(institute)}
                            className="w-full bg-gray-100 text-gray-700 mt-4 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium mb-2"
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                    {totalPages(subscribedInstitutes, 'active') > 1 && (
                      <div className="mt-6 flex justify-center space-x-2">
                        {Array.from({ length: totalPages(subscribedInstitutes, 'active') }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange('active', i + 1)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage.active === i + 1
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                  )}
                </div>
            </div>

            {/* Unsubscribed Institutes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Unsubscribed Institutes</h3>
                  <span className="bg-white text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {unsubscribedInstitutes.length} Unsubscribed
                  </span>
                </div>
              </div>
              <div className="p-6">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {paginateInstitutes(unsubscribedInstitutes, 'unsubscribed').map((institute) => (
                        <div key={institute._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 truncate">{institute.name}</h4>
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full whitespace-nowrap ml-2">
                              {institute.subscriptionStatus === 'rejected' ? 'Rejected' : 'Unsubscribed'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 truncate">{institute.email}</p>
                      <button
                            onClick={() => handleViewDetails(institute)}
                            className="w-full bg-gray-100 text-gray-700 mt-4 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium mb-2"
                      >
                            View Details
                      </button>
                        </div>
                      ))}
                    </div>
                    {totalPages(unsubscribedInstitutes, 'unsubscribed') > 1 && (
                      <div className="mt-6 flex justify-center space-x-2">
                        {Array.from({ length: totalPages(unsubscribedInstitutes, 'unsubscribed') }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange('unsubscribed', i + 1)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage.unsubscribed === i + 1
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                  )}
                </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-row items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-6xl relative">
            <h3 className="text-lg font-semibold mb-4">
              {selectedInstitute.subscription ? 'Change Subscription Plan' : 'Assign Subscription Plan'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Institute Details Modal */}
      {showDetailsModal && selectedInstituteDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Institute Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedInstituteDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedInstituteDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedInstituteDetails.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedInstituteDetails.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Information */}
                {selectedInstituteDetails.subscription && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Subscription Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Plan Name</p>
                        <p className="font-medium">{selectedInstituteDetails.subscription.planName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">${selectedInstituteDetails.subscription.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium capitalize">{selectedInstituteDetails.subscriptionStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Features</p>
                        <ul className="mt-1 space-y-1">
                          {selectedInstituteDetails.subscription.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <p className="font-medium">{selectedInstituteDetails.website || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{selectedInstituteDetails.description || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Close
                  </button>
                  {selectedInstituteDetails.subscriptionStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApproveSubscription(selectedInstituteDetails._id, selectedInstituteDetails.subscription?._id);
                          setShowDetailsModal(false);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleRejectSubscription(selectedInstituteDetails._id, selectedInstituteDetails.subscription?._id);
                          setShowDetailsModal(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedInstituteDetails.subscriptionStatus === 'active' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedInstitute(selectedInstituteDetails);
                          setShowDetailsModal(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Change Plan
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveSubscription(selectedInstituteDetails._id, selectedInstituteDetails.subscription._id);
                          setShowDetailsModal(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </>
                  )}
                  {(!selectedInstituteDetails.subscription || selectedInstituteDetails.subscriptionStatus === 'rejected') && (
                    <button
                      onClick={() => {
                        setSelectedInstitute(selectedInstituteDetails);
                        setShowDetailsModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Assign Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
