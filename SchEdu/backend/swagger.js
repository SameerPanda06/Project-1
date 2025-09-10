const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SchEdu API',
      version: '1.0.0',
      description: 'API documentation for SchEdu Backend',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  // Make sure this is an absolute path and path module is imported
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
