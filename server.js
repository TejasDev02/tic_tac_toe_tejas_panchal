const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const  createConnection = require('./utils/database');
const gameController = require('./controllers/gameController');

const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server);

createConnection();

// WebSocket
io.on('connection', gameController.handleSocketConnection);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
