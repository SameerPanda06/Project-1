const express = require('express');
const { body } = require('express-validator');
const { Subject } = require('../models');
const validateRequest = require('../middleware/validationMiddleware');
const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('code').notEmpty().withMessage('Code required'),
    body('department').optional().isString(),
    body('semester').optional().isInt(),
    body('credits').optional().isInt(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const subject = await Subject.create(req.body);
      res.status(201).json(subject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.findAll({ where: { is_active: true } });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/department/:dept', async (req, res) => {
  try {
    const subjects = await Subject.findAll({ where: { department: req.params.dept, is_active: true } });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/semester/:sem', async (req, res) => {
  try {
    const subjects = await Subject.findAll({ where: { semester: req.params.sem, is_active: true } });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Subject.update(req.body, { where: { id: req.params.id } });
    if (updatedCount === 0) return res.status(404).json({ error: 'Subject not found' });
    const updated = await Subject.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Subject.update({ is_active: false }, { where: { id: req.params.id } });
    if (updatedCount === 0) return res.status(404).json({ error: 'Subject not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
