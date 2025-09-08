const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// Middleware to restrict access based on roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

// Create notification - ONLY Admin
router.post('/', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification - ONLY Admin
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.destroy();
    return res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all notifications for authenticated users
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Modify query to filter notifications based on user/role if desired
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
