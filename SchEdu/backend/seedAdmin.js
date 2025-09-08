// seedAdmin.js
const db = require('./models'); // adjust the path to your models/index.js
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      name: 'Super Admin',
    });
    console.log('Admin user created');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit();
  }
}

seedAdmin();
