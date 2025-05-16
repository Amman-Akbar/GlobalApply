import React, { useState } from 'react';

const SubscriptionManagement = () => {
  // Example subscription data
  const initialSubscription = {
    tier: "Premium", // Example: "Free", "Premium", "Enterprise"
    expiryDate: "2025-12-31", // Example: expiry date for subscription
    features: [
      "Access to all student management tools",
      "Advanced application tracking",
      "Career Counseling Integration",
      "Priority Support"
    ]
  };

  const [subscription, setSubscription] = useState(initialSubscription);
  const [isManaging, setIsManaging] = useState(false);

  // Handle subscription tier change
  const handleTierChange = (newTier) => {
    const newSubscription = { ...subscription, tier: newTier };
    if (newTier === 'Free') {
      newSubscription.features = ["Basic student management tools"];
    } else if (newTier === 'Premium') {
      newSubscription.features = [
        "Access to all student management tools",
        "Advanced application tracking",
        "Career Counseling Integration",
        "Priority Support"
      ];
    } else if (newTier === 'Enterprise') {
      newSubscription.features = [
        "Access to all student management tools",
        "Advanced application tracking",
        "Career Counseling Integration",
        "Priority Support",
        "Custom Integration",
        "Dedicated Support Team"
      ];
    }
    setSubscription(newSubscription);
  };

  // Toggle manage subscription state
  const toggleManageSubscription = () => {
    setIsManaging(!isManaging);
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700">Subscription Management</h3>

      {/* Display current subscription details */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">Current Tier: <span className="font-semibold">{subscription.tier}</span></p>
        <p className="text-sm text-gray-500">Subscription Expiry: <span className="font-semibold">{subscription.expiryDate}</span></p>

        {/* Features List */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-600">Included Features:</h4>
          <ul className="list-disc pl-6 mt-2">
            {subscription.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600">{feature}</li>
            ))}
          </ul>
        </div>

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

      {/* Manage Subscription Form (visible when isManaging is true) */}
      {isManaging && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-700">Choose New Subscription Tier:</h4>
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400"
              onClick={() => handleTierChange('Free')}
            >
              Free
            </button>
            <button
              className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-400"
              onClick={() => handleTierChange('Premium')}
            >
              Premium
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
              onClick={() => handleTierChange('Enterprise')}
            >
              Enterprise
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
