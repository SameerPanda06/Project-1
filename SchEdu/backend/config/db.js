const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // database name
  process.env.DB_USER,       // username
  process.env.DB_PASSWORD,   // password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false            // disable logging, switch to true if debugging
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call testConnection to verify DB connection on startup
testConnection();

module.exports = sequelize;
