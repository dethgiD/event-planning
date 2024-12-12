const express = require('express');
const router = express.Router();
const { eventValidationRules, eventIdParamValidation } = require('../validators/eventValidator');
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getTasksByEventId } = require('../controllers/eventController');
const { validateRequest } = require('../middleware/validateRequest');
const { checkEventOwner, getAllEventsAccessible } = require('../middleware/authorizationMiddleware');

// Routes
router.post('/', eventValidationRules, validateRequest, createEvent); 
router.get('/', getAllEventsAccessible, getAllEvents); 
router.get('/:id', eventIdParamValidation, validateRequest, checkEventOwner, getEventById); 
router.put('/:id', eventIdParamValidation, validateRequest, checkEventOwner, eventValidationRules, updateEvent); 
router.delete('/:id', eventIdParamValidation, validateRequest, checkEventOwner, deleteEvent); 
router.get('/:id/tasks', eventIdParamValidation, validateRequest, checkEventOwner, getTasksByEventId)

module.exports = router;
