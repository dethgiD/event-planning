const { body, param } = require('express-validator');

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

const eventIdParamValidation = param('id').isInt().withMessage('Invalid event ID');

module.exports = { eventValidationRules, eventIdParamValidation };
