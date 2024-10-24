const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Task = require('../models/Task');
const TaskUpdate = require('../models/TaskUpdate');

// Validation middleware for tasks
const taskValidationRules = [
  body('eventId')
    .isInt().withMessage('Event ID must be an integer'),
  body('name')
    .trim()
    .notEmpty().withMessage('Task name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Task name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom(value => {
      const dueDate = new Date(value);
      const now = new Date();
      if (dueDate < now.setHours(0, 0, 0, 0)) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    })
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *                 description: ID of the associated event
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the task
 *                 example: "Design Mockup"
 *               description:
 *                 type: string
 *                 description: Description of the task
 *                 example: "Create a design mockup for the new feature."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Due date of the task
 *                 example: "2024-10-25"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid data"
 */
router.post('/', taskValidationRules, validateRequest, async (req, res) => {
  const { eventId, name, description, dueDate } = req.body;
  try {
    const task = await Task.create({ eventId, name, description, dueDate });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the task
 *       schema:
 *         type: integer
 *   get:
 *     summary: Retrieve a specific task by ID
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get('/:id',
  param('id').isInt().withMessage('Invalid task ID'),
  validateRequest,
  async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Design Mockup"
 *               description:
 *                 type: string
 *                 example: "Updated description of the task."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-30"
 *               status:
 *                 type: string
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.put('/:id',
  param('id').isInt().withMessage('Invalid task ID'),
  taskValidationRules,
  validateRequest,
  async (req, res) => {
    const { name, description, dueDate, status } = req.body;
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        await task.update({ name, description, dueDate, status });
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.delete('/:id',
  param('id').isInt().withMessage('Invalid task ID'),
  validateRequest,
  async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        await task.destroy();
        res.status(204).json({ message: 'Task deleted' });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /tasks/{id}/updates:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the task
 *       schema:
 *         type: integer
 *   get:
 *     summary: Retrieve all updates for a specific task
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of updates associated with the task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskUpdate'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get('/:id/updates',
  param('id').isInt().withMessage('Invalid task ID'),
  validateRequest,
  async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      const updates = await TaskUpdate.findAll({ where: { taskId: req.params.id } });
      res.json(updates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
