import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  phone: {
    type: String,
    trim: true,
    default: '6300146750',
  },
  role: {
    type: String,
    enum: ['user', 'agency', 'admin'],
    default: 'user',
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  verifyOtp: String,
  verifyOtpExpireAt: Date,
  resetOtp: String,
  resetOtpExpireAt: Date,
  savedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
    },
  ],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
