// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
