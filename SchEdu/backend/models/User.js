const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
require('dotenv').config();

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Teacher', 'Student'),
    allowNull: false,
    defaultValue: 'Student',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
