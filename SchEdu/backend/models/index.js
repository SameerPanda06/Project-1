const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Import routes
const adminSetupRoutes = require('../routes/adminSetup');

// Mount routes
app.use('/api/admin', adminSetupRoutes);

// Default root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
