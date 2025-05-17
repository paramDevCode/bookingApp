const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true, // Make sure every order is tied to a user
  },
  service: { type: String, required: true },
  pickupLatitude: Number,
  pickupLongitude: Number,
  mobile:Number,
  pickupAddress: { type: String, required: true },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  notes: String,
  imageUrls: [String],
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
