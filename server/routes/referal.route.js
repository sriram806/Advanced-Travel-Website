import express from 'express';
import {
  generateReferralCode,
  getUserReferrals,
  applyReferralCode,
  getReferralStats,
} from '../controllers/referal.controller.js';
import userAuth from '../middleware/userAuth.js';

const referalRoute = express.Router();

referalRoute.post('/generate', userAuth, generateReferralCode);
referalRoute.get('/', userAuth, getUserReferrals);
referalRoute.post('/apply', userAuth, applyReferralCode);
referalRoute.get('/stats', userAuth, getReferralStats);

export default referalRoute;
