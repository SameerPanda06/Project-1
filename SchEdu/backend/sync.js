const sequelize = require('./config/db');
const User = require('./models/User');
const Timetable = require('./models/Timetable');
const Notification = require('./models/Notification');

async function syncModels() {
  try {
    await sequelize.sync({ alter: true }); // sync all models
    console.log('Database synced with models successfully.');
    // Do not exit process here when used in app runtime
  } catch (error) {
    console.error('Error syncing models:', error);
    // Remove process.exit() for dev environment
  }
}

module.exports = syncModels;
