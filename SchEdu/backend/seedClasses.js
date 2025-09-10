const sequelize = require('./config/db');
const Class = require('./models/Class');

async function seedClasses() {
  try {
    await sequelize.sync({ alter: true });

    await Class.create({
      id: 1,            // Ensure ID is 1 to match timetable seed reference
      name: 'Class 1',
      section: 'A',
      department: 'Science',
      semester: 1,
      academic_year: '2025-2026',
      capacity: 30,
      room: 'A101',
      is_active: true,
    });

    console.log('Sample class seeded successfully');
  } catch (error) {
    console.error('Error seeding class:', error);
  } finally {
    process.exit();
  }
}

seedClasses();
