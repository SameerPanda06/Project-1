const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const validateRequest = require('../middleware/validationMiddleware');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

// Register route
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').optional().isIn(['teacher', 'student', 'admin']).withMessage('Invalid role'),
  ],
  validateRequest,
  async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(409).json({ message: 'Email already registered' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ first_name: username, email, password: hashedPassword, role });

      res.status(201).json({ message: 'User registered', userId: user.id });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        SECRET_KEY,
        { expiresIn: '8h' }
      );

      res.json({ token, role: user.role });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

module.exports = router;
