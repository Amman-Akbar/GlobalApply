import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: '' },
  role: { type: String, default: 'student' },
});
  
const User = mongoose.model('User', userSchema);
export default User;