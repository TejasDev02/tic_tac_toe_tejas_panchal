const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
// const gameRoutes = require('./routes/gameRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

// Body Parser Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data (from forms)

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
// app.use('/game', gameRoutes);
app.use('/leaderboard', leaderboardRoutes);

module.exports = app;
