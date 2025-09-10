const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger Test',
      version: '1.0.0',
      description: 'Minimal Swagger test',
    },
  },
  apis: [], // No external files, minimal
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('Hello from Swagger test'));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Swagger Test Server running at http://localhost:${PORT}/api-docs`);
});
