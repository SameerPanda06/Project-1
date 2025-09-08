const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, your role is ${req.user.role}` });
});

module.exports = router;
