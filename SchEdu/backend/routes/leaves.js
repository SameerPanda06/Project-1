const express = require('express');
const { body } = require('express-validator');
const { Leave, User } = require('../models');
const { reassignLeave } = require('../services/cspService');
const validateRequest = require('../middleware/validationMiddleware');

const router = express.Router();

const leaveValidationRules = [
  body('teacher_id').isInt().withMessage('Valid teacher ID required'),
  body('leave_type').isIn(['sick', 'casual', 'emergency', 'maternity', 'study']).withMessage('Invalid leave type'),
  body('start_date').isISO8601().withMessage('Valid start date required'),
  body('end_date').isISO8601().withMessage('Valid end date required'),
  body('reason').notEmpty().withMessage('Reason required'),
  body('status').optional().isIn(['pending', 'approved', 'rejected', 'processed']),
  body('priority').optional().isInt({ min: 1, max: 5 }),
];

router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [{ model: User, as: 'teacher', attributes: ['first_name', 'last_name', 'email'] }],
      order: [['applied_at', 'DESC']],
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', leaveValidationRules, validateRequest, async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { teacher_id: req.params.teacherId },
      order: [['applied_at', 'DESC']],
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status/:status', async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { status: req.params.status },
      include: [{ model: User, as: 'teacher', attributes: ['first_name', 'last_name', 'email'] }],
      order: [['applied_at', 'DESC']],
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id, {
      include: [{ model: User, as: 'teacher', attributes: ['first_name', 'last_name', 'email'] }],
    });
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Leave.update(req.body, { where: { id: req.params.id } });
    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    const updated = await Leave.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/approve', async (req, res) => {
  try {
    const leaveId = req.params.id;
    const leave = await Leave.findByPk(leaveId);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = 'approved';
    leave.approved_at = new Date();
    leave.approved_by = req.body.approved_by || null;
    await leave.save();

    const updatedLeave = await reassignLeave(leaveId);

    res.json({ message: 'Leave approved and timetable updated', leave: updatedLeave });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

router.patch('/:id/reject', async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    leave.status = 'rejected';
    leave.rejected_at = new Date();
    leave.rejected_by = req.body.rejected_by || null;
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
