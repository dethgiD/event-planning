const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEvent = async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        user: {
          connect: { id: req.user.id }, // Assuming the user is authenticated
        },
      },
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEventById = async (req, res) => {
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
};

const updateEvent = async (req, res) => {
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
};

const deleteEvent = async (req, res) => {
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
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
