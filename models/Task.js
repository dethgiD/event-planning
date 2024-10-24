const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./Event');
const TaskUpdate = require('./TaskUpdate');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'To Do'
  },
  dueDate: {
    type: DataTypes.DATEONLY
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tasks',
  timestamps: false
});

Task.hasMany(TaskUpdate, { foreignKey: 'taskId', as: 'updates' });
TaskUpdate.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = Task;
