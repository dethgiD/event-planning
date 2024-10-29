const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the task
 *         eventId:
 *           type: integer
 *           description: The ID of the associated event
 *         name:
 *           type: string
 *           description: The name of the task
 *         description:
 *           type: string
 *           description: A description of the task
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date of the task
 *         status:
 *           type: string
 *           description: The status of the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 */

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
 *                 description: The ID of the associated event
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: The name of the task
 *                 example: "Prepare presentation"
 *               description:
 *                 type: string
 *                 description: A description of the task
 *                 example: "Create slides for the meeting."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date of the task (YYYY-MM-DD)
 *                 example: "2024-12-01"
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
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
    const task = await prisma.task.create({
      data: { eventId, name, description, dueDate: new Date(dueDate) }
    });
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
    const tasks = await prisma.task.findMany();
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */
router.get('/:id',
  param('id').isInt().withMessage('Invalid task ID'),
  validateRequest,
  async (req, res) => {
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
 *                 description: The name of the task
 *                 example: "Update presentation"
 *               description:
 *                 type: string
 *                 description: A description of the task
 *                 example: "Update slides based on feedback."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date of the task (YYYY-MM-DD)
 *                 example: "2024-12-05"
 *               status:
 *                 type: string
 *                 description: The status of the task
 *                 example: "in-progress"
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */
router.put('/:id',
  param('id').isInt().withMessage('Invalid task ID'),
  body('name').optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Task name must be between 2 and 100 characters'),
  body('description').optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('dueDate').optional()
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom(value => {
      const dueDate = new Date(value);
      const now = new Date();
      if (dueDate < now.setHours(0, 0, 0, 0)) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  body('status').optional()
    .isString().withMessage('Status must be a string'),
  validateRequest,
  async (req, res) => {
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */
router.delete('/:id',
  param('id').isInt().withMessage('Invalid task ID'),
  validateRequest,
  async (req, res) => {
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
});

/**
 * @swagger
 * /tasks/{id}/updates:
 *   get:
 *     summary: Retrieve all updates for a specific task
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of updates for the task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   taskId:
 *                     type: integer
 *                   content:
 *                     type: string
 *                     description: The content of the update
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation timestamp of the update
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */
router.get('/:id/updates',
  param('id').isInt().withMessage('Invalid task ID'),
  validateRequest,
  async (req, res) => {
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
  }
);

module.exports = router;
