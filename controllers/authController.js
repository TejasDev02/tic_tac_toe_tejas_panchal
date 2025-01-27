const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../entities/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_KEY;

// Joi schema for validation
const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      'string.base': 'Username must be a string.',
      'string.empty': 'Username is required.',
      'string.alphanum': 'Username must only contain alphanumeric characters.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username cannot exceed 30 characters.',
      'any.required': 'Username is required.',
    }),
    password: Joi.string().min(6).required().messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.',
    }),
  }),
  login: Joi.object({
    username: Joi.string().required().messages({
      'string.empty': 'Username is required.',
      'any.required': 'Username is required.',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.',
    }),
  }),
};

// Register API
exports.register = async (req, res) => {
  try {
    // Validate request body
    const { error } = schemas.register.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.wins = 0;
    user.losses = 0;
    user.draws = 0;

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login API
exports.login = async (req, res) => {
  try {
    // Validate request body
    const { error } = schemas.login.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('JWT_SECRET', JWT_SECRET);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};
