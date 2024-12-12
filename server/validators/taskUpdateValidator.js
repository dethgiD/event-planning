const { body, param, validationResult } = require('express-validator');

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

// Validation for task update ID
const taskUpdateIdValidation = [
  param('id').isInt().withMessage('Task update ID must be an integer'),
];

module.exports = {
  taskUpdateValidationRules,
  validateRequest,
  taskUpdateIdValidation,
};
