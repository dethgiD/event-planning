// Middleware for checking if the user is the owner of the event
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkEventOwner = async (req, res, next) => {
    const eventId = parseInt(req.params.id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
  
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
  
    if (req.user.role === 'ADMIN' || event.userId === req.user.id) {
      return next(); // User is the owner or is an admin
    }
  
    return res.status(403).json({ error: 'You are not authorized to access this event' });
  };
  
  // Middleware for checking if the user is the owner of the task
  const checkTaskOwner = async (req, res, next) => {
    const taskId = parseInt(req.params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { event: true } });
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    if (req.user.role === 'ADMIN' || task.userId === req.user.id || task.event.userId === req.user.id) {
      return next(); // User is the owner or is an admin
    }
  
    return res.status(403).json({ error: 'You are not authorized to access this task' });
  };
  
  // Middleware for checking if the user is the owner of the task update
  const checkTaskUpdateOwner = async (req, res, next) => {
    const taskUpdateId = parseInt(req.params.id);
    const taskUpdate = await prisma.taskUpdate.findUnique({ where: { id: taskUpdateId }, include: { task: { include: { event: true } } } });
  
    if (!taskUpdate) {
      return res.status(404).json({ error: 'Task update not found' });
    }
  
    if (req.user.role === 'ADMIN' || taskUpdate.userId === req.user.id || taskUpdate.task.userId === req.user.id || taskUpdate.task.event.userId === req.user.id) {
      return next(); // User is the owner or is an admin
    }
  
    return res.status(403).json({ error: 'You are not authorized to access this task update' });
  };

  const getAllEventsAccessible = async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        where: req.user.role === 'ADMIN' ? {} : { userId: req.user.id },  // Admin sees all, others see only their events
      });
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getAllTasksAccessible = async (req, res) => {
    try {
      const tasks = await prisma.task.findMany({
        where: req.user.role === 'ADMIN' ? {} : {  // Admin sees all, others see only their tasks or tasks within events they own
          OR: [
            { userId: req.user.id }, // User's own tasks
            { event: { userId: req.user.id } }, // Tasks within events the user owns
          ],
        },
      });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getAllTaskUpdatesAccessible = async (req, res) => {
    try {
      const taskUpdates = await prisma.taskUpdate.findMany({
        where: req.user.role === 'ADMIN' ? {} : {  // Admin sees all, others see only their task updates
          OR: [
            { userId: req.user.id }, // User's own task updates
            { task: { userId: req.user.id } }, // Task updates for tasks the user owns
            { task: { event: { userId: req.user.id } } }, // Task updates for tasks in events the user owns
          ],
        },
      });
      res.json(taskUpdates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { checkEventOwner, checkTaskOwner, checkTaskUpdateOwner, getAllEventsAccessible, getAllTasksAccessible, getAllTaskUpdatesAccessible }