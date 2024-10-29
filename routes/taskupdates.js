const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Validation rules for TaskUpdate creation
const taskUpdateValidationRules = [
  body('taskId')
    .isInt().withMessage('Task ID must be an integer'),
  body('updateText')
    .trim()
    .notEmpty().withMessage('Update text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Update text must be between 1 and 500 characters')
];

// Validation middleware
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
 *   name: Task Updates
 *   description: API endpoints for managing task updates
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the task update
 *         taskId:
 *           type: integer
 *           description: The ID of the associated task
 *         updateText:
 *           type: string
 *           description: The text of the update
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 */

/**
 * @swagger
 * /task-updates:
 *   post:
 *     summary: Create a new task update
 *     tags: [Task Updates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *                 description: ID of the associated task
 *                 example: 1
 *               updateText:
 *                 type: string
 *                 description: The update text
 *                 example: "Task has been started."
 *     responses:
 *       201:
 *         description: Task update created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskUpdate'
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
router.post('/', taskUpdateValidationRules, validateRequest, async (req, res) => {
  const { taskId, updateText } = req.body;
  try {
    const taskUpdate = await prisma.taskUpdate.create({
      data: {
        taskId,
        updateText,
      },
    });
    res.status(201).json(taskUpdate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /task-updates:
 *   get:
 *     summary: Retrieve all task updates
 *     tags: [Task Updates]
 *     responses:
 *       200:
 *         description: A list of task updates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskUpdate'
 */
router.get('/', async (req, res) => {
  try {
    const taskUpdates = await prisma.taskUpdate.findMany();
    res.json(taskUpdates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /task-updates/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the task update
 *       schema:
 *         type: integer
 *   get:
 *     summary: Retrieve a specific task update by ID
 *     tags: [Task Updates]
 *     responses:
 *       200:
 *         description: Task update details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskUpdate'
 *       404:
 *         description: Task update not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task Update not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get('/:id', 
  param('id').isInt().withMessage('Task update ID must be an integer'), 
  validateRequest,
  async (req, res) => {
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
});

/**
 * @swagger
 * /task-updates/{id}:
 *   put:
 *     summary: Update a task update by ID
 *     tags: [Task Updates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateText:
 *                 type: string
 *                 example: "Updated task progress."
 *     responses:
 *       200:
 *         description: Task update updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskUpdate'
 *       404:
 *         description: Task update not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task Update not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.put('/:id', 
  param('id').isInt().withMessage('Task update ID must be an integer'), 
  body('updateText')
    .trim()
    .notEmpty().withMessage('Update text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Update text must be between 1 and 500 characters'),
  validateRequest,
  async (req, res) => {
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
});

/**
 * @swagger
 * /task-updates/{id}:
 *   delete:
 *     summary: Delete a task update by ID
 *     tags: [Task Updates]
 *     responses:
 *       204:
 *         description: Task update deleted successfully
 *       404:
 *         description: Task update not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task Update not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.delete('/:id', 
  param('id').isInt().withMessage('Task update ID must be an integer'), 
  validateRequest,
  async (req, res) => {
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
});

module.exports = router;
