const User = require('../entities/User');

// Fetch Top 10 Players
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({
      order: {
        wins: 'DESC', // Sort by wins in descending order
      },
      take: 10, // Limit to top 10 players
    });

    // Map leaderboard data to only include necessary fields
    const result = leaderboard.map((user) => ({
      username: user.username,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'An error occurred while fetching the leaderboard.' });
  }
};

module.exports = {
  getLeaderboard,
};
