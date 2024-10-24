const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Task = require('../models/Task');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API endpoints for managing events
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         description:
 *           type: string
 *           description: A description of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
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
 *         status:
 *           type: string
 *           description: The current status of the task
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date of the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 */

// Validation middleware
const eventValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Event name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Event name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom(value => {
      const date = new Date(value);
      const now = new Date();
      if (date < now.setHours(0, 0, 0, 0)) {
        throw new Error('Event date cannot be in the past');
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
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the event (2-100 characters)
 *                 example: "Team Meeting"
 *               description:
 *                 type: string
 *                 description: Description of the event (max 500 characters)
 *                 example: "Discuss project progress and next steps."
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the event (must be future date)
 *                 example: "2024-10-20"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
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
 *
 *   get:
 *     summary: Retrieve all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /events/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the event
 *       schema:
 *         type: integer
 *   get:
 *     summary: Retrieve a specific event by ID
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the event (2-100 characters)
 *                 example: "Updated Team Meeting"
 *               description:
 *                 type: string
 *                 description: Description of the event (max 500 characters)
 *                 example: "Updated description of the event."
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the event (must be future date)
 *                 example: "2024-10-21"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */

/**
 * @swagger
 * /events/{id}/tasks:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the event
 *       schema:
 *         type: integer
 *   get:
 *     summary: Retrieve all tasks for a specific event
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of tasks associated with the event
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */

router.post('/', eventValidationRules, validateRequest, async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const event = await Event.create({ name, description, date });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id',
  param('id').isInt().withMessage('Invalid event ID'),
  validateRequest,
  async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.put('/:id',
  param('id').isInt().withMessage('Invalid event ID'),
  eventValidationRules,
  validateRequest,
  async (req, res) => {
    const { name, description, date } = req.body;
    try {
      const event = await Event.findByPk(req.params.id);
      if (event) {
        await event.update({ name, description, date });
        res.json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.delete('/:id',
  param('id').isInt().withMessage('Invalid event ID'),
  validateRequest,
  async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (event) {
        await event.destroy();
        res.status(204).json({ message: 'Event deleted' });
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/:id/tasks',
  param('id').isInt().withMessage('Invalid event ID'),
  validateRequest,
  async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [
          {
            model: Task,
            as: 'tasks'
          }
        ]
      });
      if (event) {
        res.json(event.tasks);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;