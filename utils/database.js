const { DataSource } = require('typeorm');
const User = require('../entities/User');
const GameRoom = require('../entities/GameRoom');
const GameSession = require('../entities/GameSession');
const { profileEnd } = require('console');
require('dotenv').config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [User, GameRoom, GameSession],
  synchronize: true,
});

const createDBConnection = async () => {
  try {
    await dataSource.initialize();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

module.exports = createDBConnection;
