// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // For password hashing

const prisma = new PrismaClient();

const seed = async () => {
  // Clear existing data (optional, you can remove if you don't want to clear previous data)
  await prisma.task.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Hashing passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users (1 Admin, 2 Regular users)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: "admin",
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'user1',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'user2',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log(`Created admin: ${admin.email}`);
  console.log(`Created user1: ${user1.email}`);
  console.log(`Created user2: ${user2.email}`);

  // Create events for users
  const event1 = await prisma.event.create({
    data: {
      name: 'Event for User1',
      description: 'Description for User1 Event',
      date: new Date(),
      user: { connect: { id: user1.id } }, // Event owned by user1
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Event for User2',
      description: 'Description for User2 Event',
      date: new Date(),
      user: { connect: { id: user2.id } }, // Event owned by user2
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: 'Admin Event',
      description: 'Description for Admin Event',
      date: new Date(),
      user: { connect: { id: admin.id } }, // Event owned by admin
    },
  });

  console.log(`Created event: ${event1.name}`);
  console.log(`Created event: ${event2.name}`);
  console.log(`Created event: ${event3.name}`);

  // Create tasks for each event
  const task1 = await prisma.task.create({
    data: {
      name: 'Task for Event1',
      description: 'Task description for Event1',
      eventId: event1.id,
      userId: user1.id, // Task assigned to user1
    },
  });

  const task2 = await prisma.task.create({
    data: {
      name: 'Task for Event2',
      description: 'Task description for Event2',
      eventId: event2.id,
      userId: user2.id, // Task assigned to user2
    },
  });

  const task3 = await prisma.task.create({
    data: {
      name: 'Admin Task',
      description: 'Task for admin event',
      eventId: event3.id,
      userId: admin.id, // Task assigned to admin
    },
  });

  console.log(`Created task: ${task1.name}`);
  console.log(`Created task: ${task2.name}`);
  console.log(`Created task: ${task3.name}`);

  // Create task updates
  const taskUpdate1 = await prisma.taskUpdate.create({
    data: {
      taskId: task1.id,
      updateText: 'User1 is working on the task.',
      userId: user1.id, // Task update created by user1
    },
  });

  const taskUpdate2 = await prisma.taskUpdate.create({
    data: {
      taskId: task2.id,
      updateText: 'User2 completed the task.',
      userId: user2.id, // Task update created by user2
    },
  });

  const taskUpdate3 = await prisma.taskUpdate.create({
    data: {
      taskId: task3.id,
      updateText: 'Admin is reviewing the task.',
      userId: admin.id, // Task update created by admin
    },
  });

  console.log(`Created task update: ${taskUpdate1.updateText}`);
  console.log(`Created task update: ${taskUpdate2.updateText}`);
  console.log(`Created task update: ${taskUpdate3.updateText}`);
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
