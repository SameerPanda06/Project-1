const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SystemSetup = sequelize.define('SystemSetup', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  academic_year: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  current_semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  working_days: {
    type: DataTypes.JSONB,
    defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  },
  periods_per_day: {
    type: DataTypes.INTEGER,
    defaultValue: 8
  },
  period_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  break_times: {
    type: DataTypes.JSONB
  },
  csp_settings: {
    type: DataTypes.JSONB
  },
  leave_settings: {
    type: DataTypes.JSONB
  },
  notification_settings: {
    type: DataTypes.JSONB
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'system_setup',
  timestamps: true,
  underscored: true
});

module.exports = SystemSetup;
