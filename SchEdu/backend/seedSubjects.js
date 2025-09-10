const sequelize = require('./config/db');
const Subject = require('./models/Subject');

async function seedSubjects() {
  try {
    await sequelize.sync({ alter: true });

    await Subject.bulkCreate([
      {
        id: 101,
        name: 'Mathematics',
        code: 'MATH101',
        department: 'Science',
        semester: 1,
        credits: 3,
      },
      {
        id: 102,
        name: 'Physics',
        code: 'PHYS101',
        department: 'Science',
        semester: 1,
        credits: 3,
      },
      {
        id: 103,
        name: 'Chemistry',
        code: 'CHEM101',
        department: 'Science',
        semester: 1,
        credits: 3,
      },
    ]);

    console.log('Sample subjects seeded successfully');
  } catch (error) {
    console.error('Error seeding subjects:', error);
  } finally {
    process.exit();
  }
}

seedSubjects();
