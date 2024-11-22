const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const authRoutes = require('./routes/auth'); // Import authentication routes
const eventRoutes = require('./routes/events');
const taskRoutes = require('./routes/tasks');
const taskUpdateRoutes = require('./routes/taskupdates');
const swaggerSetup = require('./swagger');
const { authenticate, authorize } = require('./auth/authMiddleware');

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware for parsing JSON
swaggerSetup(app); // Swagger setup

// Middleware to attach Prisma client to requests
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Authentication and Authorization Routes
app.use('/api/auth', authRoutes);

// Routes with Authentication Middleware
app.use('/api/events', authenticate, authorize(['USER', 'ADMIN']), eventRoutes);
app.use('/api/tasks', authenticate, authorize(['USER', 'ADMIN']), taskRoutes);
app.use('/api/task-updates', authenticate, authorize(['USER', 'ADMIN']), taskUpdateRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
