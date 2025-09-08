const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leave = sequelize.define('Leave', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weekStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  daysApplied: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
});

module.exports = Leave;
