import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js"

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Token not found!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid token payload!" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found!" });
    }
    req.user = user._id;
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, login again!" });
  }
};

const adminAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Token not found!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid token payload!" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found!" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied. Admin only!" });
    }

    req.user = user._id;
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, login again!" });
  }
};

export { userAuth, adminAuth };
export default userAuth;
