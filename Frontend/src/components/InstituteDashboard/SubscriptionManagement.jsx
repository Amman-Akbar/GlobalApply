import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isManaging, setIsManaging] = useState(false);

  // Fetch available subscriptions and current subscription
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch available subscriptions
        const subscriptionsResponse = await axios.get('http://localhost:3000/api/v1/subscriptions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAvailableSubscriptions(subscriptionsResponse.data);

        // Fetch current user's subscription
        const userResponse = await axios.get('http://localhost:3000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (userResponse.data.subscription) {
          setCurrentSubscription(userResponse.data.subscription);
        }
      } catch (err) {
        setError('Failed to fetch subscription data. Please try again later.');
        console.error('Error fetching subscription data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle subscription purchase
  const handlePurchaseSubscription = async (subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:3000/api/v1/subscriptions/assign',
        {
          subscriptionId,
          instituteId: localStorage.getItem('userId') // Assuming userId is stored in localStorage
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update current subscription
      const updatedSubscription = availableSubscriptions.find(
        sub => sub._id === subscriptionId
      );
      setCurrentSubscription(updatedSubscription);
      setIsManaging(false);

      // Show success message
      alert('Subscription purchased successfully!');
    } catch (err) {
      setError('Failed to purchase subscription. Please try again.');
      console.error('Error purchasing subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle manage subscription state
  const toggleManageSubscription = () => {
    setIsManaging(!isManaging);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="text-center">Loading subscription data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700">Subscription Management</h3>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Display current subscription details */}
      <div className="mt-4">
        {currentSubscription ? (
          <>
            <p className="text-sm text-gray-500">
              Current Plan: <span className="font-semibold">{currentSubscription.planName}</span>
            </p>
            <p className="text-sm text-gray-500">
              Price: <span className="font-semibold">{currentSubscription.price}</span>
            </p>

            {/* Features List */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-600">Your Plan Features:</h4>
              <ul className="list-disc pl-6 mt-2">
                {currentSubscription.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No active subscription</p>
        )}

        {/* Subscription Management Options */}
        <div className="mt-6">
          <button
            className="bg-[#1D5EC7] text-white py-2 px-4 rounded-lg hover:bg-[#306fd6] transition duration-300"
            onClick={toggleManageSubscription}
          >
            {isManaging ? "Cancel" : "Manage Subscription"}
          </button>
        </div>
      </div>

      {/* Available Subscriptions (visible when isManaging is true) */}
      {isManaging && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-4">Available Subscription Plans:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSubscriptions
              .filter(sub => sub.status === 'Active')
              .map((subscription) => (
                <div
                  key={subscription._id}
                  className="border rounded-lg p-4 hover:shadow-lg transition duration-300"
                >
                  <h5 className="font-semibold text-lg">{subscription.planName}</h5>
                  <p className="text-xl font-bold text-[#1D5EC7] mt-2">{subscription.price}</p>
                  <ul className="mt-4 space-y-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
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
                    onClick={() => handlePurchaseSubscription(subscription._id)}
                    disabled={loading || currentSubscription?._id === subscription._id}
                    className={`mt-4 w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
                      currentSubscription?._id === subscription._id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#1D5EC7] hover:bg-[#306fd6]'
                    }`}
                  >
                    {currentSubscription?._id === subscription._id
                      ? 'Current Plan'
                      : 'Purchase Plan'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
