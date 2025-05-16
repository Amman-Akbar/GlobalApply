import React, { useState, useEffect } from 'react';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const subscriptionResponse = [
        {
          id: 1,
          planName: 'Basic Plan',
          price: 'Free',
          features: ['Limited to applications', 'Email support'],
          status: 'Active',
          users: 120,
        },
        {
          id: 2,
          planName: 'Premium Plan',
          price: 'Rs 9,999/month',
          features: ['Priority support', 'Advanced analytics'],
          status: 'Inactive',
          users: 50,
        },
        {
          id: 3,
          planName: 'Enterprise Plan',
          price: 'Rs 29,999/month',
          features: ['Dedicated support', 'Custom integrations'],
          status: 'Active',
          users: 15,
        },
      ];
      setSubscriptions(subscriptionResponse);
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    subscription.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSubscriptionStatus = (id) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? { ...sub, status: sub.status === 'Active' ? 'Inactive' : 'Active' }
          : sub
      )
    );
  };

  const deleteSubscription = (id) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    }
  };

  const saveSubscription = (updatedSubscription) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === updatedSubscription.id ? updatedSubscription : sub
      )
    );
    setSelectedSubscription(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Search & Manage Subscriptions</h3>
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
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Plan Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Features</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Users</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="text-center">
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
                  <td className="border border-gray-300 p-2">{subscription.users}</td>
                  <td className="border border-gray-300 p-2 flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      onClick={() => toggleSubscriptionStatus(subscription.id)}
                      className={`px-3 py-1 rounded ${
                        subscription.status === 'Active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {subscription.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setSelectedSubscription(subscription)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSubscription(subscription.id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
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
      </div>

      {/* Edit Subscription Modal */}
      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Subscription Plan</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveSubscription(selectedSubscription);
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
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubscription(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
