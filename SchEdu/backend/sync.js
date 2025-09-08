const sequelize = require('./config/db');
const User = require('./models/User');
const Timetable = require('./models/Timetable');
const Notification = require('./models/Notification');

async function syncModels() {
  try {
    await sequelize.sync({ alter: true }); // sync all models
    console.log('Database synced with models successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing models:', error);
    process.exit(1);
  }
}

syncModels();
