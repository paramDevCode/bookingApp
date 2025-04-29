const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const authenticate = require('../middleware/authMiddleware');

// Create a new order (protected route)
router.post('/', authenticate, async (req, res) => {
  const { customerName, contactNumber, status, measurements, items } = req.body;

  const order = new Order({
    customerName,
    contactNumber,
    status,
    measurements,
    items
  });

  try {
    await order.save();
    res.status(201).send(order);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all orders (protected route)
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get an order by ID (protected route)
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).send('Order not found');
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update an order (protected route)
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { customerName, contactNumber, status, measurements, items } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      customerName,
      contactNumber,
      status,
      measurements,
      items
    }, { new: true });

    if (!updatedOrder) return res.status(404).send('Order not found');
    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete an order (protected route)
router.delete('/orders/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).send('Order not found');
    res.status(200).send('Order deleted');
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
