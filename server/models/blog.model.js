import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking'],
    required: true
  },
  specialRequests: String,
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically calculate endDate based on package duration
bookingSchema.pre('save', async function (next) {
  if (this.isModified('startDate') || this.isNew) {
    try {
      const Package = mongoose.model('Package');
      const packageDoc = await Package.findById(this.package);
      if (packageDoc) {
        const endDate = new Date(this.startDate);
        endDate.setDate(endDate.getDate() + packageDoc.duration);
        this.endDate = endDate;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
