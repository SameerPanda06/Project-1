const sequelize = require('./config/db');
const User = require('./models/User');

async function seed() {
  await sequelize.sync({ force: true }); // Warning: wipes existing data!

  await User.bulkCreate([
    { username: 'adminuser', email: 'admin@example.com', passwordHash: 'hashed_password_here', role: 'Admin' },
    { username: 'teacheruser', email: 'teacher@example.com', passwordHash: 'hashed_password_here', role: 'Teacher' },
    { username: 'studentuser', email: 'student@example.com', passwordHash: 'hashed_password_here', role: 'Student' },
  ]);

  console.log('Seed completed');
  process.exit();
}

seed();
