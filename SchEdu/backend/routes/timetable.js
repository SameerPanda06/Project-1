const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Timetable = require('../models/Timetable');

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

// Create timetable entry - ONLY Admin
router.post('/', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    return res.status(201).json(timetable);  // return added here
  } catch (error) {
    return res.status(500).json({ message: error.message });  // return added here
  }
});

// Get all timetable entries - all authenticated users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const timetables = await Timetable.findAll();
    return res.json(timetables);  // return added here
  } catch (error) {
    return res.status(500).json({ message: error.message });  // return added here
  }
});

// Update timetable entry - ONLY Admin
router.put('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Not found' });  // return here important
    }
    await timetable.update(req.body);
    return res.json(timetable);  // return added here
  } catch (error) {
    return res.status(500).json({ message: error.message });  // return added here
  }
});

// Delete timetable entry - ONLY Admin
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Not found' });  // return here important
    }
    await timetable.destroy();
    return res.json({ message: 'Deleted successfully' });  // return added here
  } catch (error) {
    return res.status(500).json({ message: error.message });  // return added here
  }
});

module.exports = router;
