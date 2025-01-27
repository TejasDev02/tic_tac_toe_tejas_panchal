const express = require('express');
const { createRoom, joinRoom, listRooms } = require('../controllers/roomController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/create', authenticate, createRoom);
router.post('/:roomId/join', authenticate, joinRoom);
router.get('/', authenticate, listRooms);


module.exports = router;
