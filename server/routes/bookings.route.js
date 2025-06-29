import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking
} from '../controllers/bookings.controller.js';

import userAuth from '../middleware/userAuth.js';

const bookingsRouter = express.Router();

// Protect all routes below
bookingsRouter.use(userAuth);

// User routes
bookingsRouter.post('/', createBooking);
bookingsRouter.get('/', getUserBookings);

bookingsRouter.get('/:id', getBooking);
bookingsRouter.put('/:id/cancel', cancelBooking);

// Agency/Admin only routes
bookingsRouter.put('/:id/status',  updateBookingStatus);
bookingsRouter.put('/:id/payment',  updatePaymentStatus);

export default bookingsRouter;
