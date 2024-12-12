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
      name: "Admin User",
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'Alice Johnson',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Bob Smith',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log(`Created admin: ${admin.email}`);
  console.log(`Created user1: ${user1.email}`);
  console.log(`Created user2: ${user2.email}`);

  // Create meaningful events for users
  const events = [
    {
      name: 'Annual Company Retreat',
      description: 'A weekend retreat for team building and relaxation.',
      date: new Date('2024-05-15'),
      userId: user1.id, // Event owned by user1
    },
    {
      name: 'Product Launch Party',
      description: 'Launch party for our new product line with food, drinks, and entertainment.',
      date: new Date('2024-06-10'),
      userId: user2.id, // Event owned by user2
    },
    {
      name: 'Charity Fundraiser Gala',
      description: 'An evening gala to raise funds for local charities with auctions and performances.',
      date: new Date('2024-07-20'),
      userId: admin.id, // Event owned by admin
    },
  ];

  const createdEvents = await Promise.all(events.map(event => 
    prisma.event.create({ data: event })
  ));

  createdEvents.forEach(event => console.log(`Created event: ${event.name}`));

  // Create tasks for each event
  const tasksData = [
    [
      {
        name: 'Book venue for retreat',
        description: 'Find and book a suitable venue for the company retreat.',
        userId: user1.id,
      },
      {
        name: 'Arrange transportation',
        description: 'Organize transportation for all participants to the retreat location.',
        userId: user1.id,
      },
      {
        name: 'Plan team-building activities',
        description: 'Design engaging activities for team building during the retreat.',
        userId: user1.id,
      },
    ],
    [
      {
        name: 'Create marketing materials',
        description: 'Design and print flyers and banners for the product launch.',
        userId: user2.id,
      },
      {
        name: 'Coordinate catering services',
        description: 'Select and coordinate with catering services for the event.',
        userId: user2.id,
      },
      {
        name: 'Set up event registration',
        description: 'Create a registration process for guests attending the launch party.',
        userId: user2.id,
      },
    ],
    [
      {
        name: 'Organize auction items',
        description: 'Collect and organize items for the charity auction.',
        userId: admin.id,
      },
      {
        name: 'Promote the gala event',
        description: 'Use social media and local channels to promote the charity gala.',
        userId: admin.id,
      },
      {
        name: 'Arrange entertainment',
        description: 'Book performers or speakers for the gala evening.',
        userId: admin.id,
      },
    ],
  ];

  const createdTasks = [];
  
  for (let i = 0; i < createdEvents.length; i++) {
    const tasksForEvent = await Promise.all(tasksData[i].map(task =>
      prisma.task.create({
        data: {
          ...task,
          eventId: createdEvents[i].id,
        }
      })
    ));
    
    createdTasks.push(tasksForEvent);
    
    tasksForEvent.forEach(task => console.log(`Created task for ${createdEvents[i].name}: ${task.name}`));
  }

  // Create task updates for each task
  const taskUpdatesData = [
    [
      [
        { updateText: 'Venue has been booked at Mountain Resort.', userId: user1.id },
        { updateText: 'Venue deposit paid.', userId: user1.id },
        { updateText: 'Confirmed final headcount with venue.', userId: user1.id }
      ],
      
      [
        { updateText: 'Transportation company contacted.', userId: user1.id },
        { updateText: 'Bus schedule confirmed.', userId: user1.id },
        { updateText: 'All participants have been informed about transportation details.', userId:user1.id }
      ],

      [
        { updateText:'Activities planned and materials prepared.',userId:user1.id},
        { updateText:'Team-building facilitators confirmed.',userId:user1.id},
        { updateText:'Final schedule sent to all participants.',userId:user1.id}
       ]
      
     ],
     [
       [
         { updateText:'Marketing materials designed and approved.',userId:user2.id},
         { updateText:'Flyers printed and distributed.',userId:user2.id},
         { updateText:'Online promotions started.',userId:user2.id}
       ],

       [
         { updateText:'Catering options reviewed.',userId:user2.id},
         { updateText:'Menu finalized with caterer.',userId:user2.id},
         { updateText:'Catering contract signed.',userId:user2.id}
       ],

       [
         { updateText:'Registration page live on website.',userId:user2.id},
         { updateText:'Email invitations sent to guests.',userId:user2.id},
         { updateText:'Confirmation emails received from attendees.',userId:user2.id}
       ]
     ],
     [
       [
         { updateText:'Auction items collected from local businesses.',userId:user1.id},
         { updateText:'Auction catalog being prepared.',userId:user1.id},
         { updateText:'Auctioneer confirmed for the evening.',userId:user1.id}
       ],

       [
         { updateText:'Social media campaign launched.',userId:user1.id},
         { updateText:'Press release sent to local news outlets.',userId:user1.id},
         { updateText:'Flyers distributed in community centers.',userId:user1.id}
       ],

       [
         { updateText:'Entertainment lineup finalized.',userId:user1.id},
         { updateText:'Contracts signed with performers.',userId:user1.id},
         { updateText:'Sound system booked for the evening.',userId:user1.id}
       ]
     ]
   ];

   for (let i = 0; i < createdTasks.length; i++) {
     for (let j = 0; j < createdTasks[i].length; j++) {
       const updatesForTask = await Promise.all(taskUpdatesData[i][j].map(update =>
         prisma.taskUpdate.create({
           data:{
             ...update,
             taskId : createdTasks[i][j].id
           }
         })
       ));
       
       updatesForTask.forEach(update => console.log(`Created task update for ${createdTasks[i][j].name}: ${update.updateText}`));
     }
   }
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
