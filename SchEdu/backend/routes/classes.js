const express = require('express');
const { body } = require('express-validator');
const { Class } = require('../models');
const validateRequest = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('section').optional().isString(),
    body('department').optional().isString(),
    body('semester').optional().isInt(),
    body('academic_year').optional().isString(),
    body('capacity').optional().isInt(),
    body('room').optional().isString(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const classData = await Class.create(req.body);
      res.status(201).json(classData);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const classes = await Class.findAll({ where: { is_active: true } });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/department/:dept', async (req, res) => {
  try {
    const classes = await Class.findAll({ where: { department: req.params.dept, is_active: true } });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);
    if (!classData) return res.status(404).json({ error: 'Class not found' });
    res.json(classData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Class.update(req.body, { where: { id: req.params.id } });
    if (updatedCount === 0) return res.status(404).json({ error: 'Class not found' });
    const updated = await Class.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Class.update({ is_active: false }, { where: { id: req.params.id } });
    if (updatedCount === 0) return res.status(404).json({ error: 'Class not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
