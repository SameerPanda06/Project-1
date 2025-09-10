const sequelize = require('./config/db');
const Timetable = require('./models/Timetable');

async function seedTimetable() {
  try {
    // Sample timetable schedule JSON structure
    const sampleSchedule = {
      monday: [
        { period: 1, subject_id: 101, teacher_id: 1, room: 'A101' },
        { period: 2, subject_id: 102, teacher_id: 2, room: 'A102' }
      ],
      tuesday: [
        { period: 1, subject_id: 103, teacher_id: 3, room: 'B201' },
        { period: 2, subject_id: 101, teacher_id: 1, room: 'B202' }
      ],
      // Add other weekdays similarly
    };

    await sequelize.sync({ alter: true }); // Sync DB models

    await Timetable.create({
      class_id: 1,            // Adjust as per your class IDs
      academic_year: '2025-2026',
      semester: 1,
      schedule: sampleSchedule,
      version: 1,
      is_active: true,
    });

    console.log('Sample timetable seeded successfully');
  } catch (error) {
    console.error('Error seeding timetable:', error);
  } finally {
    process.exit();
  }
}

seedTimetable();
