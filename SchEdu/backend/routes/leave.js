const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Leave, Notification } = require('../models');

// Middleware to check authentication and set req.user must be applied above this router

router.post('/', async (req, res) => {
  const teacherId = req.user.id;
  const { weekStartDate, daysApplied } = req.body;

  if (!weekStartDate || !daysApplied) {
    return res.status(400).json({ message: 'Week start date and days applied are required.' });
  }

  if (typeof daysApplied !== 'number' || daysApplied < 1 || daysApplied > 2) {
    return res.status(400).json({ message: 'Days applied must be 1 or 2.' });
  }

  try {
    const parsedWeekStart = new Date(weekStartDate);

    // Start and end of the month for the leave date
    const startOfMonth = new Date(parsedWeekStart.getFullYear(), parsedWeekStart.getMonth(), 1);
    const endOfMonth = new Date(parsedWeekStart.getFullYear(), parsedWeekStart.getMonth() + 1, 0);

    // Calculate total approved leave days for the same week
    const leavesThisWeek = await Leave.sum('daysApplied', {
      where: {
        teacherId,
        weekStartDate: parsedWeekStart,
        status: 'Approved',
      },
    }) || 0;

    if (leavesThisWeek + daysApplied > 2) {
      return res.status(400).json({ message: 'Weekly leave limit of 2 days exceeded.' });
    }

    // Calculate total approved leave days for the month
    const leavesThisMonth = await Leave.sum('daysApplied', {
      where: {
        teacherId,
        weekStartDate: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        status: 'Approved',
      },
    }) || 0;

    if (leavesThisMonth + daysApplied > 4) {
      return res.status(400).json({ message: 'Monthly leave limit of 4 days exceeded.' });
    }

    // Create approved leave
    const newLeave = await Leave.create({
      teacherId,
      weekStartDate: parsedWeekStart,
      daysApplied,
      status: 'Approved',
    });

    // Notify user of approval
    await Notification.create({
      userId: teacherId,
      message: `Your leave request for the week starting on ${weekStartDate} has been approved automatically.`,
      type: 'leave',
    });

    return res.status(201).json(newLeave);
  } catch (error) {
    console.error('Error processing leave application:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Optional: get leaves for logged-in teacher
router.get('/', async (req, res) => {
  const teacherId = req.user.id;

  try {
    const leaves = await Leave.findAll({
      where: { teacherId },
      order: [['weekStartDate', 'DESC']],
    });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
