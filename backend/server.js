const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth'); // Import auth routes
const uploadRoutes = require('./routes/upload');
const orderRoutes = require('./routes/orders');

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular frontend URL
  credentials: true,               // Allow sending and receiving cookies
};
// Enable CORS
app.use(cors(corsOptions));
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));
app.use('/api', uploadRoutes);

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tailoringApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Use orders and auth routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
const crypto = require('crypto');

// Configure multer storage for uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure this folder exists
  },
 filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
  cb(null, uniqueSuffix + '-' + file.originalname);
}
});

const upload = multer({ storage: storage });

// Upload images endpoint
app.post('/api/upload-images', upload.array('images', 4), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    path: file.path,
  }));

  res.json({ message: 'Upload successful', files: uploadedFiles });
});



// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Tailoring App API');
});



// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
