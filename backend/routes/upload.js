const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload images endpoint
router.post('/upload-images', upload.array('images', 4), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    path: file.path,
  }));

  res.json({ message: 'Upload successful', files: uploadedFiles });
});

// DELETE image endpoint
router.delete('/delete-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ message: 'Failed to delete image' });
    }
    res.json({ message: 'Image deleted successfully' });
  });
});

module.exports = router;
