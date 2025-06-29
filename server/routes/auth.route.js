import express from 'express';
import { register, login, logout, isAuthenticated } from "../controllers/auth.controller.js";
import userAuth from '../middleware/userAuth.js';

const authRoute = express.Router();

authRoute.post('/register', register);// Register route
authRoute.post('/login', login);// Login route
authRoute.post('/logout', userAuth, logout);// Logout route

export default authRoute;
