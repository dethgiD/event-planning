const express = require('express');
const router = express.Router();
const {
  createTaskUpdate,
  getAllTaskUpdates,
  getTaskUpdateById,
  updateTaskUpdateById,
  deleteTaskUpdateById
} = require('../controllers/taskUpdateController');
const {
  taskUpdateValidationRules,
  validateRequest,
  taskUpdateIdValidation
} = require('../validators/taskUpdateValidator');
const { checkTaskUpdateOwner, getAllTaskUpdatesAccessible } = require('../middleware/authorizationMiddleware');

// Create a new task update
router.post('/', taskUpdateValidationRules, validateRequest, createTaskUpdate);

// Get all task updates
router.get('/', getAllTaskUpdatesAccessible, getAllTaskUpdates);

// Get a specific task update by ID
router.get('/:id', checkTaskUpdateOwner, taskUpdateIdValidation, validateRequest, checkTaskUpdateOwner, getTaskUpdateById);

// Update a task update by ID
router.put('/:id', taskUpdateIdValidation, taskUpdateValidationRules, validateRequest, checkTaskUpdateOwner, updateTaskUpdateById);

// Delete a task update by ID
router.delete('/:id', taskUpdateIdValidation, validateRequest, checkTaskUpdateOwner, deleteTaskUpdateById);

module.exports = router;
