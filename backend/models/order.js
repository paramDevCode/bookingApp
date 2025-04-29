const mongoose = require('mongoose');

// Define Order Schema
const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number
  },
  items: [{
    name: String,
    quantity: Number
  }]
});

// Create a model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
