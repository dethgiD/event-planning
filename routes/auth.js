const express = require('express');
const { body } = require('express-validator');
const { register, login, refreshToken } = require('../auth/authController');
const { authenticate } = require('../auth/authMiddleware');

const router = express.Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    register
);

router.post('/login', login);

router.post('/refresh-token', authenticate, refreshToken);

module.exports = router;