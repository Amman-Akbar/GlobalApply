import Subscription from '../models/subscription.model.js';
import Institute from '../models/institute.model.js';

// Get all subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

// Create new subscription
export const createSubscription = async (req, res) => {
  try {
    const { planName, price, features, status } = req.body;
    const subscription = new Subscription({
      planName,
      price,
      features,
      status: status || 'Active'
    });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { planName, price, features, status } = req.body;
    
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.planName = planName || subscription.planName;
    subscription.price = price || subscription.price;
    subscription.features = features || subscription.features;
    subscription.status = status || subscription.status;

    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if any institutes are subscribed to this plan
    const subscribedInstitutes = await Institute.find({ subscription: id });
    if (subscribedInstitutes.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete subscription plan that has active institutes. Please reassign institutes to different plans first.' 
      });
    }

    await subscription.deleteOne();
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
};

// Toggle subscription status
export const toggleSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = subscription.status === 'Active' ? 'Inactive' : 'Active';
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling subscription status', error: error.message });
  }
};

// Assign subscription to institute
export const assignSubscription = async (req, res) => {
  try {
    const { subscriptionId, instituteId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    // If institute already has a subscription, decrement the old subscription's institute count
    if (institute.subscription) {
      const oldSubscription = await Subscription.findById(institute.subscription);
      if (oldSubscription) {
        await oldSubscription.decrementInstitutes();
      }
    }

    // Update institute's subscription
    institute.subscription = subscriptionId;
    await institute.save();

    // Increment new subscription's institute count
    await subscription.incrementInstitutes();

    res.json({ message: 'Subscription assigned successfully', institute });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning subscription', error: error.message });
  }
};

// Remove subscription from institute
export const removeSubscription = async (req, res) => {
  try {
    const { subscriptionId, instituteId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    if (institute.subscription?.toString() !== subscriptionId) {
      return res.status(400).json({ message: 'Institute is not subscribed to this plan' });
    }

    // Remove subscription from institute
    institute.subscription = null;
    await institute.save();

    // Decrement subscription's institute count
    await subscription.decrementInstitutes();

    res.json({ message: 'Subscription removed successfully', institute });
  } catch (error) {
    res.status(500).json({ message: 'Error removing subscription', error: error.message });
  }
}; 