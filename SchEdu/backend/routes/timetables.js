const express = require('express');
const { body } = require('express-validator');
const { Timetable, Class } = require('../models');
const validateRequest = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json(timetable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.findAll({
      include: [{ model: Class, attributes: ['name', 'section', 'department'] }],
      where: { is_active: true }
    });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/class/:classId', async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      where: { class_id: req.params.classId, is_active: true },
      include: [{ model: Class, attributes: ['name', 'section', 'department'] }]
    });
    if (!timetable) return res.status(404).json({ error: 'Timetable not found' });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/year/:year/semester/:semester', async (req, res) => {
  try {
    const timetables = await Timetable.findAll({
      where: {
        academic_year: req.params.year,
        semester: req.params.semester,
        is_active: true
      },
      include: [{ model: Class, attributes: ['name', 'section', 'department'] }]
    });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/schedule', async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id);
    if (!timetable) return res.status(404).json({ error: 'Timetable not found' });

    timetable.schedule = req.body.schedule;
    timetable.version += 1;
    timetable.last_optimized = new Date();
    await timetable.save();

    res.json(timetable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id, {
      include: [{ model: Class, attributes: ['name', 'section', 'department'] }]
    });
    if (!timetable) return res.status(404).json({ error: 'Timetable not found' });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Timetable.update(req.body, { where: { id: req.params.id } });
    if (updatedCount === 0) return res.status(404).json({ error: 'Timetable not found' });
    const updated = await Timetable.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
