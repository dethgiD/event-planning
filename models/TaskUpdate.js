const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');  // Import the Task model

const TaskUpdate = sequelize.define('TaskUpdate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.INTEGER,
    references: {
      model: Task,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  updateText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'task_updates',
  timestamps: false
});

module.exports = TaskUpdate;
