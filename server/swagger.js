// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Event Management API',
    version: '1.0.0',
    description: 'API documentation for the Event Management System',
  },
  servers: [
    {
      url: 'http://localhost:3000/api', // Replace with your actual base URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API route files to generate docs
};


// Initialize swagger-jsdoc -> returns validated swagger spec in JSON format
const swaggerSpec = swaggerJsdoc(options);

// Exporting a function to set up Swagger in the app
const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Exporting the YAML file
  fs.writeFileSync('./swagger.yaml', yaml.dump(swaggerSpec), 'utf8', (err) => {
    if (err) {
      console.error('Error writing YAML file:', err);
    } else {
      console.log('Swagger YAML file generated successfully!');
    }
  });
};

module.exports = swaggerSetup;