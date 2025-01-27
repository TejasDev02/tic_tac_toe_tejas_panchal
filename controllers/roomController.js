const Joi = require('joi');
const GameRoom = require('../entities/GameRoom');

// Joi schemas for validation
const schemas = {
  createRoom: Joi.object({
    roomName: Joi.string().min(3).max(50).required().messages({
      'string.base': 'Room name must be a string.',
      'string.empty': 'Room name is required.',
      'string.min': 'Room name must be at least 3 characters long.',
      'string.max': 'Room name cannot exceed 50 characters.',
      'any.required': 'Room name is required.',
    }),
    isPrivate: Joi.boolean().required().messages({
      'boolean.base': 'isPrivate must be a boolean.',
      'any.required': 'isPrivate is required.',
    }),
  }),
  joinRoom: Joi.object({
    joinCode: Joi.string().length(6).when('isPrivate', {
      is: true,
      then: Joi.required().messages({
        'string.empty': 'Join code is required for private rooms.',
        'string.length': 'Join code must be exactly 6 characters long.',
        'any.required': 'Join code is required.',
      }),
    }),
  }),
};

// Create Room API
exports.createRoom = async (req, res) => {
  try {
    // Validate request body
    const { error } = schemas.createRoom.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { roomName, isPrivate } = req.body;
    const joinCode = isPrivate ? Math.random().toString(36).substring(2, 8) : null;

    const room = new GameRoom();
    room.roomName = roomName;
    room.createdBy = req.userId; // req.userId is set by middleware
    room.isPrivate = isPrivate;
    room.joinCode = joinCode;

    await room.save();
    res.status(201).json({ message: 'Room created successfully', joinCode });
  } catch (error) {
    console.error('Error during room creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Join Room API
exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { joinCode } = req.body;


    const { error } = schemas.joinRoom.validate({ joinCode });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const room = await GameRoom.findOne({ where: { id: roomId } });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.isPrivate && room.joinCode !== joinCode) {
      return res.status(403).json({ message: 'Invalid join code' });
    }

    res.json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error('Error during room joining:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// List Rooms API
exports.listRooms = async (req, res) => {
  try {
    const rooms = await GameRoom.find({ where: { isPrivate: false } });
    res.json(rooms);
  } catch (error) {
    console.error('Error during room listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
