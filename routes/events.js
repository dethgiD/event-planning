const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Validation rules for event creation and updates
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
 *           format: date-time
 *           description: The date and time of the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 */

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
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the event
 *                 example: "Annual Meeting"
 *               description:
 *                 type: string
 *                 description: The event description
 *                 example: "Discussing the annual results."
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event (YYYY-MM-DD)
 *                 example: "2024-12-01"
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
router.post('/', eventValidationRules, validateRequest, async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const event = await prisma.event.create({
      data: { name, description, date: new Date(date) },
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /events:
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
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
  param('id').isInt().withMessage('Invalid event ID'), 
  validateRequest,
  async (req, res) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /events/{id}:
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
 *                 description: The name of the event
 *                 example: "Updated Meeting"
 *               description:
 *                 type: string
 *                 description: The event description
 *                 example: "Discussing the updated results."
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event (YYYY-MM-DD)
 *                 example: "2024-12-05"
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
  param('id').isInt().withMessage('Invalid event ID'), 
  eventValidationRules,
  validateRequest,
  async (req, res) => {
    const { name, description, date } = req.body;
    try {
      const event = await prisma.event.update({
        where: { id: parseInt(req.params.id) },
        data: { name, description, date: new Date(date) },
      });
      res.json(event);
    } catch (err) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'Event not found' });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
});

/**
 * @swagger
 * /events/{id}:
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
 */
router.delete('/:id', 
  param('id').isInt().withMessage('Invalid event ID'), 
  validateRequest,
  async (req, res) => {
    try {
      await prisma.event.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.status(204).send();
    } catch (err) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'Event not found' });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
});

/**
 * @swagger
 * /events/{id}/tasks:
 *   get:
 *     summary: Retrieve all tasks for a specific event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of tasks for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the task
 *                   eventId:
 *                     type: integer
 *                     description: The ID of the associated event
 *                   name:
 *                     type: string
 *                     description: The name of the task
 *                   description:
 *                     type: string
 *                     description: A description of the task
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                     description: The due date of the task
 *                   status:
 *                     type: string
 *                     description: The status of the task
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation timestamp
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
router.get('/:id/tasks',
  param('id').isInt().withMessage('Invalid event ID'),
  validateRequest,
  async (req, res) => {
    try {
      const event = await req.prisma.event.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { tasks: true }, 
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
