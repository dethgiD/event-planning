// taskValidation.js
const { body, param } = require('express-validator');

const taskValidationRules = {
  create: [
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
  ],
  update: [
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
      .isString().withMessage('Status must be a string')
  ],
  get: [
    param('id').isInt().withMessage('Invalid task ID')
  ]
};

module.exports = taskValidationRules;
