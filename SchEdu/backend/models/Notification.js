const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null means global notification
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true, // role to whom notification is sent (optional)
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Notification;
