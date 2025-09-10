const db = require('./models'); // Adjust the path accordingly
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      first_name: 'Super',
      last_name: 'Admin',
    });

    console.log('Admin user created');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit();
  }
}

seedAdmin();
