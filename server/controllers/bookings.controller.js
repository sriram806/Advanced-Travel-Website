import Booking from '../models/bookings.model.js';
import Package from '../models/package.model.js';
import User from '../models/user.model.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const packages = await Package.findById(req.body.package);
    if (!packages) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Calculate total price
    const totalPrice = packages.price * req.body.numberOfPeople;

    // Calculate endDate based on package.duration and startDate
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + packages.duration);

    const booking = new Booking({
      ...req.body,
      user: req.user._id,
      totalPrice,
      endDate, // explicitly set endDate here
    });

    const savedBooking = await booking.save();

    // Add booking to user's trips array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { trips: savedBooking._id }
    });

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('package')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      !['agency', 'admin'].includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Agency
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!['agency', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to update booking status' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private/Agency
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!['agency', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to update payment status' });
    }

    booking.paymentStatus = paymentStatus;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
