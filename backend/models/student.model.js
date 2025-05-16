import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // Personal Details
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  nationality: {
    type: String,
    required: false
  },

  // Education Details
  college: {
    type: String,
    required: false
  },
  graduationYear: {
    type: Number,
    required: false
  },
  result10th: {
    type: String,
    required: false
  },
  result12th: {
    type: String,
    required: false
  },

  // Contact Information
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },

  // Parent/Guardian Information
  parentName: {
    type: String,
    required: false
  },
  parentEmail: {
    type: String,
    required: false
  },
  parentPhone: {
    type: String,
    required: false
  },

  // Emergency Contact
  emergencyContactName: {
    type: String,
    required: false
  },
  emergencyContactPhone: {
    type: String,
    required: false
  },

  // Additional Information
  disability: {
    type: String,
    default: ''
  },

  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Student = mongoose.model('Student', studentSchema);

export default Student; 