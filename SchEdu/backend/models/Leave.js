const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leave = sequelize.define('Leave', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  leave_type: {
    type: DataTypes.ENUM('sick', 'casual', 'emergency', 'maternity', 'study'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'processed'),
    defaultValue: 'pending'
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  approved_at: {
    type: DataTypes.DATE
  },
  approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  csp_processing_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notifications_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 5
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'leaves',
  timestamps: true,
  underscored: true
});

module.exports = Leave;
