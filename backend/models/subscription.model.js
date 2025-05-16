import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  institutes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to increment institute count
subscriptionSchema.methods.incrementInstitutes = async function() {
  this.institutes += 1;
  return this.save();
};

// Method to decrement institute count
subscriptionSchema.methods.decrementInstitutes = async function() {
  if (this.institutes > 0) {
    this.institutes -= 1;
    return this.save();
  }
  return this;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription; 