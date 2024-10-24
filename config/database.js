const Sequelize = require('sequelize')

const sequelize = new Sequelize('event-planning', 'postgres', 'slaptazodis', {
    dialect: 'postgres'
});

sequelize.authenticate().then(() => {
    console.log("Connection successful")
}).catch((err) => {
    console.log(err)
});

module.exports = sequelize;