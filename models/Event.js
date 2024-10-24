const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'events',
  timestamps: false
});

Event.hasMany(Task, { foreignKey: 'eventId', as: 'tasks' });
Task.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = Event;
