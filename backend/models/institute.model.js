import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semesterFee: { type: String, required: true },
  duration: { type: String, required: true },
  levelofProgram: { type: String, required: true },
  deadline: { type: String, required: true },
  isActive: { type: Boolean, default: false },  // ✅ Tracks if the program has an active posting
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  programs: { type: [programSchema], default: [] },
});

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  feeRange: { type: String },
  logo: { type: String },
  subscription: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null 
  },
  subscriptionStatus: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: null
  },
  description: { type: String },
  image: { type: String },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  departments: { type: [departmentSchema], default: [] },
  facilities: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
});

const Institute = mongoose.model('Institute', instituteSchema);

export default Institute;
