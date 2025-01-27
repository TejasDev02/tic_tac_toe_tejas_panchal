const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/', authenticate, getLeaderboard);

module.exports = router;
