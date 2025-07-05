import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV, SMTP_EMAIL } from "../config/env.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import sendMail from "../config/nodemailer.js";


export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password"
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
    };
    if (phone) userData.phone = phone;
    const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const data = {
      name: user.name,
      email: user.email,
    };

    try {
      await sendMail({
        email: user.email,
        subject: "🎉 Welcome to Flyobo Travel",
        template: "registration",
        data,
      });
    } catch (mailErr) {
      console.error('Email sending failed:', mailErr);
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message
    });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password"
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if account is verified
    if (!user.isAccountVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first"
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const sanitizedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "Error in login"
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: "Error in logout"
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // OTP generation
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10-minute expiration
    await user.save();

    // Send OTP via email using the sendMail function
    try {
      await sendMail({
        email: user.email,
        subject: "🔐 Verify Your Flyobo Travel Account",
        template: "verification",
        data: {
          name: user.name,
          otp: otp
        }
      });

      return res.json({ success: true, message: "OTP sent successfully" });
    } catch (mailError) {
      console.error("Error sending OTP email:", mailError);
      return res.status(500).json({ success: false, message: "Error sending OTP email" });
    }
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return res.status(500).json({ success: false, message: "Error in sending OTP" });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Please provide all the fields" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user is not found" });
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '',
      user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email Verified" })
  } catch (error) {
    return res.json({ success: false, message: "Error in verifying email" });
  }
}
// check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: "Not authenticated" });
  }
}

//send otp for password reset
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Please provide email" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified === false) {
      return res.status(403).json({ success: false, message: "Account not verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // OTP generation
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10-minute expiration
    await user.save();

    // Send OTP via email using the sendMail function
    try {
      await sendMail({
        email: email,
        subject: "🔐 Reset Your Flyobo Travel Password",
        template: "reset-password",
        data: {
          name: user.name,
          otp: otp
        }
      });

      return res.json({ success: true, message: "Reset Password OTP sent successfully" });
    } catch (mailError) {
      console.error("Error sending OTP email:", mailError);
      return res.status(500).json({ success: false, message: "Error sending OTP email" });
    }
  } catch (error) {
    console.error("Error in sending Reset Password OTP:", error);
    return res.status(500).json({ success: false, message: "Error in sending Reset Password OTP" });
  }
}

export const resetPassword = async (req, res) => {
  const { email, newpassword, otp } = req.body;
  if (!email || !newpassword || !otp) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isAccountVerified) {
      return res.status(403).json({ success: false, message: "Account not verified" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(410).json({ success: false, message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({
      success: false,
      message: "Email and name are required"
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const { password, ...rest } = user._doc;
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: rest
      });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      
      const newUser = new User({
        name: name,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: googlePhotoUrl || 'https://via.placeholder.com/150',
        isAccountVerified: true, // Google accounts are pre-verified
        role: 'user'
      });
      
      await newUser.save();
      
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const { password, ...rest } = newUser._doc;
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return res.status(201).json({
        success: true,
        message: "Registration successful",
        user: rest
      });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      success: false,
      message: "Error in Google authentication"
    });
  }
};