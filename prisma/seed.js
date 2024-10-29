// seed.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create some events
  const event1 = await prisma.event.create({
    data: {
      name: 'Project Kickoff',
      description: 'Kickoff meeting for the new project.',
      date: new Date('2024-11-01T09:00:00Z'), // Example date
      tasks: {
        create: [
          {
            name: 'Define Project Scope',
            description: 'Outline the scope of the project.',
            dueDate: new Date('2024-11-05T00:00:00Z'),
            updates: {
              create: [
                {
                  updateText: 'Scope defined and shared with the team.',
                },
              ],
            },
          },
          {
            name: 'Set Milestones',
            description: 'Establish key project milestones.',
            dueDate: new Date('2024-11-10T00:00:00Z'),
            updates: {
              create: [
                {
                  updateText: 'Milestones created and under review.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Sprint Review',
      description: 'Review meeting for the last sprint.',
      date: new Date('2024-11-15T10:00:00Z'),
      tasks: {
        create: [
          {
            name: 'Prepare Presentation',
            description: 'Create slides for the sprint review.',
            dueDate: new Date('2024-11-14T00:00:00Z'),
            updates: {
              create: [
                {
                  updateText: 'Slides are in progress.',
                },
              ],
            },
          },
          {
            name: 'Gather Feedback',
            description: 'Collect feedback from the team on the sprint.',
            dueDate: new Date('2024-11-16T00:00:00Z'),
          },
        ],
      },
    },
  });

  console.log({ event1, event2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
