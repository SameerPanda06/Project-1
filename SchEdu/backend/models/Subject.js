const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(255)
  },
  semester: {
    type: DataTypes.INTEGER
  },
  credits: {
    type: DataTypes.INTEGER
  },
  description: DataTypes.TEXT,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'subjects',
  timestamps: true,
  underscored: true
});

module.exports = Subject;
