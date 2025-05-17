const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit order', error: err });
  }
});

// Get all orders by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by userId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/orders/:customerId
router.get('/orders/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Route to get a single order by its _id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log('Requested ID:', id);

  try {
    const order = await Order.findOne({ _id: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
