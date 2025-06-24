import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true,
  },
  program: {
    type: String, // or ObjectId if you have a Program model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  additionalInfo: {
    type: Object,
    default: {},
  },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;