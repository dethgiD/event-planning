const express = require('express');
const router = express.Router();
const taskValidationRules = require('../validators/taskValidator');
const { validateRequest } = require('../middleware/validateRequest');
const taskController = require('../controllers/taskController');
const { checkTaskOwner, getAllTasksAccessible } = require('../middleware/authorizationMiddleware');

// Create a new task
router.post('/', taskValidationRules.create, validateRequest, taskController.createTask);

// Get all tasks
router.get('/', getAllTasksAccessible, taskController.getAllTasks);

// Get a specific task by ID
router.get('/:id', taskValidationRules.get, checkTaskOwner, validateRequest, taskController.getTaskById);

// Update a task by ID
router.put('/:id', taskValidationRules.update, checkTaskOwner, validateRequest, taskController.updateTask);

// Delete a task by ID
router.delete('/:id', taskValidationRules.get, checkTaskOwner, validateRequest, taskController.deleteTask);

// Get updates for a specific task
router.get('/:id/updates', taskValidationRules.get, checkTaskOwner, validateRequest, taskController.getTaskUpdates);

module.exports = router;