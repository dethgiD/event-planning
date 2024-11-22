const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a task update
const createTaskUpdate = async (req, res) => {
    const { taskId, updateText } = req.body;
    const userId = req.user.id; 
    
    // Check if the task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role !== 'ADMIN' || task.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to access this event' });
    }
  
    try {
      const taskUpdate = await prisma.taskUpdate.create({
        data: {
          task: {
            connect: { id: taskId },  
          },
          user: {
            connect: { id: userId }, 
          },
          updateText,
        },
      });
      res.status(201).json(taskUpdate);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

// Get all task updates
const getAllTaskUpdates = async (req, res) => {
  try {
    const taskUpdates = await prisma.taskUpdate.findMany();
    res.json(taskUpdates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get task update by ID
const getTaskUpdateById = async (req, res) => {
  try {
    const taskUpdate = await prisma.taskUpdate.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (taskUpdate) {
      res.json(taskUpdate);
    } else {
      res.status(404).json({ error: 'Task Update not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task update by ID
const updateTaskUpdateById = async (req, res) => {
  const { updateText } = req.body;
  try {
    const taskUpdate = await prisma.taskUpdate.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (taskUpdate) {
      const updatedTaskUpdate = await prisma.taskUpdate.update({
        where: { id: parseInt(req.params.id) },
        data: { updateText },
      });
      res.json(updatedTaskUpdate);
    } else {
      res.status(404).json({ error: 'Task Update not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete task update by ID
const deleteTaskUpdateById = async (req, res) => {
  try {
    const taskUpdate = await prisma.taskUpdate.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (taskUpdate) {
      await prisma.taskUpdate.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.status(204).json({ message: 'Task Update deleted' });
    } else {
      res.status(404).json({ error: 'Task Update not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTaskUpdate,
  getAllTaskUpdates,
  getTaskUpdateById,
  updateTaskUpdateById,
  deleteTaskUpdateById,
};
