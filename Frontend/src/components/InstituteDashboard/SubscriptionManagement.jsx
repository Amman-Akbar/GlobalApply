import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionManagement = ({ instituteId }) => {
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
        const userResponse = await axios.get('http://localhost:3000/api/v1/auth/me', {
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
          instituteId
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

      {currentSubscription ? (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-700">Current Subscription</h4>
          <div className="mt-4 p-4 border rounded-lg">
            <p className="font-semibold">{currentSubscription.planName}</p>
            <p className="text-gray-600">{currentSubscription.price}</p>
            <ul className="mt-2">
              {currentSubscription.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
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
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-gray-600">No active subscription</p>
          <button
            onClick={toggleManageSubscription}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Available Plans
          </button>
        </div>
      )}

      {isManaging && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-700">Available Plans</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableSubscriptions
              .filter(sub => sub.status === 'Active')
              .map((subscription) => (
                <div key={subscription._id} className="border rounded-lg p-4">
                  <h5 className="font-semibold">{subscription.planName}</h5>
                  <p className="text-gray-600">{subscription.price}</p>
                  <ul className="mt-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
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
                    disabled={loading}
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Select Plan'}
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
