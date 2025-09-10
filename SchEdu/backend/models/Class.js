const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  section: {
    type: DataTypes.STRING(50)
  },
  department: {
    type: DataTypes.STRING(255)
  },
  semester: {
    type: DataTypes.INTEGER
  },
  academic_year: {
    type: DataTypes.STRING(15)
  },
  capacity: {
    type: DataTypes.INTEGER
  },
  room: {
    type: DataTypes.STRING(50)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'classes',
  timestamps: true,
  underscored: true
});

module.exports = Class;
