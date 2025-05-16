import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const SubscriptionManagement = () => {
  const { user } = useUser();
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isManaging, setIsManaging] = useState(false);

  // Fetch available subscriptions and current subscription
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Fetch available subscriptions
        const subscriptionsResponse = await axios.get('http://localhost:3000/api/v1/subscriptions', { headers });
        setAvailableSubscriptions(subscriptionsResponse.data);

        // Fetch institute data to get current subscription
        const instituteResponse = await axios.get(
          `http://localhost:3000/api/v1/institute/user/${user.id}`,
          { headers }
        );

        if (instituteResponse.data.success) {
          const institute = instituteResponse.data.data;
          if (institute.subscription) {
            // Find the full subscription details from available subscriptions
            const fullSubscriptionDetails = subscriptionsResponse.data.find(
              sub => sub._id === institute.subscription
            );
            
            if (fullSubscriptionDetails) {
              setCurrentSubscription(fullSubscriptionDetails);
              setSubscriptionStatus(institute.subscriptionStatus || 'pending');
            } else {
              // If subscription details not found, use the basic data
              setCurrentSubscription(institute.subscription);
              setSubscriptionStatus(institute.subscriptionStatus || 'pending');
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch subscription data. Please try again later.');
        console.error('Error fetching subscription data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Handle subscription purchase
  const handlePurchaseSubscription = async (subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        'http://localhost:3000/api/v1/subscriptions/assign',
        {
          subscriptionId,
          instituteId: user.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update current subscription
        const updatedSubscription = availableSubscriptions.find(
          sub => sub._id === subscriptionId
        );
        setCurrentSubscription(updatedSubscription);
        setSubscriptionStatus('pending');
        setIsManaging(false);

        // Show success message
        alert('Subscription request submitted successfully! Waiting for admin approval.');
      } else {
        throw new Error(response.data.message || 'Failed to request subscription');
      }
    } catch (err) {
      setError('Failed to request subscription. Please try again.');
      console.error('Error requesting subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle manage subscription state
  const toggleManageSubscription = () => {
    setIsManaging(!isManaging);
  };

  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case 'pending':
        return 'Your subscription request is pending approval.';
      case 'active':
        return 'Your subscription is active.';
      case 'rejected':
        return 'Your subscription request was rejected.';
      default:
        return 'No active subscription';
    }
  };

  const getStatusColor = () => {
    switch (subscriptionStatus) {
      case 'pending':
        return 'text-yellow-600';
      case 'active':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-800">{currentSubscription.planName}</p>
                <p className="text-xl text-gray-600">${currentSubscription.price}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                subscriptionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
              </span>
            </div>
            <p className={`mt-2 font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
            <div className="mt-4">
              <h5 className="font-medium text-gray-700 mb-2">Plan Features:</h5>
              <ul className="space-y-2">
                {(currentSubscription.features || []).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
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
            {subscriptionStatus === 'rejected' && (
              <button
                onClick={toggleManageSubscription}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Request New Plan
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-gray-600">No active subscription</p>
          <button
            onClick={toggleManageSubscription}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
                  <h5 className="font-semibold">{subscription.planName || 'N/A'}</h5>
                  <p className="text-gray-600">${subscription.price || '0'}</p>
                  <ul className="mt-2">
                    {(subscription.features || []).map((feature, index) => (
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
                    disabled={loading || currentSubscription?._id === subscription._id}
                    className={`mt-4 w-full py-2 px-4 rounded text-white ${
                      currentSubscription?._id === subscription._id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {currentSubscription?._id === subscription._id
                      ? 'Current Plan'
                      : 'Select Plan'}
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
