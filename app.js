const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const eventRoutes = require('./routes/events');
const taskRoutes = require('./routes/tasks');
const taskUpdateRoutes = require('./routes/taskupdates');
const swaggerSetup = require('./swagger');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
swaggerSetup(app);

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-updates', taskUpdateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});