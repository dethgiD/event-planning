const express = require('express');
const sequelize = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskUpdateRoutes = require('./routes/taskUpdateRoutes');
const swaggerSetup = require('./swagger');


const app = express();

app.use(express.json());
swaggerSetup(app);

sequelize.sync();

app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-updates', taskUpdateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});