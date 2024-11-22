const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Hash a password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Validate a password
const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate a JWT token
const generateToken = (user) => {
    const payload = {
        id: user.id,
        role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
};

// Verify a JWT token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Find user by email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

// Create a new user
const createUser = async (data) => {
    data.password = await hashPassword(data.password); // Hash the password
    return await prisma.user.create({ data });
};

// Generate a Refresh JWT token
const generateRefreshToken = (user) => {
  const payload = {
      userId: user.id,
      role: user.role
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Renew token
const renewAccessToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const newAccessToken=generateToken(user);
  
      return newAccessToken;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  };

module.exports = {
    hashPassword,
    validatePassword,
    generateToken,
    verifyToken,
    findUserByEmail,
    createUser,
    renewAccessToken,
    generateRefreshToken
};