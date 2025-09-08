const express = require('express');
const router = express.Router();
const { generateTimetable } = require('../services/timetableScheduler');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles'); // Create this middleware or use similar from earlier
const Timetable = require('../models/Timetable'); // Import Timetable model if not already
const SystemSetup = require('../models/SystemSetup');

// Create or update system setup data
router.post('/', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { numTeachers, numStudents, numClasses, numSubjects } = req.body;

    if (
      numTeachers == null || numStudents == null ||
      numClasses == null || numSubjects == null
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    let setup = await SystemSetup.findOne();
    if (!setup) {
      setup = await SystemSetup.create({ numTeachers, numStudents, numClasses, numSubjects });
    } else {
      await setup.update({ numTeachers, numStudents, numClasses, numSubjects });
    }

    return res.json(setup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Optional: GET current setup data
router.get('/', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const setup = await SystemSetup.findOne();
    return res.json(setup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Admin-only route to generate timetable
router.post('/generate-timetable', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const timetable = await generateTimetable();
    // Save timetable to DB or return generated data
    // For now, just return dummy data
    res.json({ timetable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/generate-timetable', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const timetable = await generateTimetable();

    // Clear existing timetable entries (optional: or handle incremental updates)
    await Timetable.destroy({ where: {} });

    // Save newly generated timetable assignments
    await Timetable.bulkCreate(timetable);

    res.json({ message: 'Timetable generated and saved successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
