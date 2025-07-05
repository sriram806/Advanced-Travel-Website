import express from 'express';
import { 
  register, 
  login, 
  logout, 
  isAuthenticated, 
  sendVerifyOtp, 
  verifyEmail, 
  sendResetOtp, 
  resetPassword, 
  google 
} from "../controllers/auth.controller.js";
import userAuth from '../middleware/userAuth.js';

const authRoute = express.Router();

authRoute.post('/register', register);// Register route
authRoute.post('/login', login);// Login route
authRoute.post('/logout', userAuth, logout);// Logout route
authRoute.get('/isAuthenticated', userAuth, isAuthenticated);// Check authentication
authRoute.post('/send-verify-otp', userAuth, sendVerifyOtp);// Send verification OTP
authRoute.post('/verify-email', userAuth, verifyEmail);// Verify email with OTP
authRoute.post('/send-reset-otp', sendResetOtp);// Send password reset OTP
authRoute.post('/reset-password', resetPassword);// Reset password with OTP
authRoute.post('/google', google);// Google OAuth

export default authRoute;
