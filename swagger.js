const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tic-Tac-Toe API',
      version: '1.0.0',
      description: 'API documentation for Tic-Tac-Toe backend',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsDoc(options);
