import User from '../models/user.model.js';
import Institute from '../models/institute.model.js';
import Subscription from '../models/subscription.model.js';
import Wishlist from '../models/wishlist.model.js';

export const getAnalytics = async (req, res) => {
  try {
    // Get total users count with validation
    const totalUsers = await User.countDocuments();
    if (totalUsers === null) {
      throw new Error('Failed to fetch user count');
    }

    // Get active subscriptions count with validation
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    if (activeSubscriptions === null) {
      throw new Error('Failed to fetch active subscriptions count');
    }

    // Get total applications (wishlist items) with validation
    const totalApplications = await Wishlist.countDocuments();
    if (totalApplications === null) {
      throw new Error('Failed to fetch total applications count');
    }

    // Get monthly applications for the current year with validation
    const currentYear = new Date().getFullYear();
    const monthlyApplications = await Wishlist.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    if (!Array.isArray(monthlyApplications)) {
      throw new Error('Failed to fetch monthly applications data');
    }

    // Format monthly applications data
    const monthlyData = Array(12).fill(0);
    monthlyApplications.forEach(item => {
      if (item._id >= 1 && item._id <= 12) {
        monthlyData[item._id - 1] = item.count;
      }
    });

    // Get subscription breakdown with validation
    const subscriptionBreakdown = await Subscription.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 }
        }
      }
    ]);

    if (!Array.isArray(subscriptionBreakdown)) {
      throw new Error('Failed to fetch subscription breakdown data');
    }

    // Format subscription breakdown data
    const subscriptionData = subscriptionBreakdown.map(item => item.count);

    // Validate the final data structure
    const analyticsData = {
      users: totalUsers,
      activeSubscriptions,
      totalApplications,
      monthlyApplications: monthlyData,
      subscriptionBreakdown: subscriptionData
    };

    // Validate all required fields are present and are numbers
    const requiredFields = ['users', 'activeSubscriptions', 'totalApplications'];
    for (const field of requiredFields) {
      if (typeof analyticsData[field] !== 'number') {
        throw new Error(`Invalid data type for ${field}`);
      }
    }

    if (!Array.isArray(analyticsData.monthlyApplications) || analyticsData.monthlyApplications.length !== 12) {
      throw new Error('Invalid monthly applications data structure');
    }

    if (!Array.isArray(analyticsData.subscriptionBreakdown)) {
      throw new Error('Invalid subscription breakdown data structure');
    }

    res.status(200).json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
}; 