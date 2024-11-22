// taskController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
    const { eventId, name, description, dueDate } = req.body;
    const userId = req.user.id;  // Assuming the user is authenticated and their ID is in req.user
  
    // Check if the event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    // Check if user is the event owner
    if (req.user.role !== 'ADMIN' || event.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to access this event' });
    }
  
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
  
    try {
      const task = await prisma.task.create({
        data: {
          event: {
            connect: { id: eventId },
          },
          user: {
            connect: { id: userId },
          },
          name,
          description,
          dueDate: new Date(dueDate),
        },
      });
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { name, description, dueDate, status } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } });
    if (task) {
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(req.params.id) },
        data: {
          name: name !== undefined ? name : task.name,
          description: description !== undefined ? description : task.description,
          dueDate: dueDate !== undefined ? new Date(dueDate) : task.dueDate,
          status: status !== undefined ? status : task.status
        }
      });
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } });
    if (task) {
      await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskUpdates = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updates = await prisma.taskUpdate.findMany({ where: { taskId: parseInt(req.params.id) } });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskUpdates
};
