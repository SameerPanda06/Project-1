const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SystemSetup = sequelize.define('SystemSetup', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numTeachers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numClasses: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numSubjects: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = SystemSetup;
