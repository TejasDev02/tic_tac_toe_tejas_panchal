const User = require('../entities/User'); // Import the User entity
const games = {}; // Game state storage

exports.handleSocketConnection = (socket) => {
  socket.on('joinRoom', ({ roomId, userId }) => {
    if (!games[roomId]) {
      games[roomId] = {
        board: Array(3).fill(null).map(() => Array(3).fill(null)),
        currentPlayer: userId,
        players: [userId],
      };
    } else {
      games[roomId].players.push(userId);
    }

    if (games[roomId].players.length === 2) {
      socket.to(roomId).emit('startGame', { board: games[roomId].board });
    }
  });

  socket.on('makeMove', async ({ roomId, userId, x, y }) => {
    const game = games[roomId];
    if (!game || game.currentPlayer !== userId || game.board[x][y] !== null) return;

    // Update board and switch turn
    game.board[x][y] = userId;
    game.currentPlayer = game.players.find((p) => p !== userId);
    socket.to(roomId).emit('updateBoard', { board: game.board });

    // Check the game result
    const result = checkGameResult(game.board, userId);
    if (result) {
      if (result.winner) {
        const winnerId = result.winner;
        const loserId = game.players.find((p) => p !== winnerId);
        await updatePlayerStats(winnerId, loserId, 'win');
      } else if (result.draw) {
        const [player1, player2] = game.players;
        await updatePlayerStats(player1, player2, 'draw');
      }

      socket.to(roomId).emit('gameEnd', result);
      delete games[roomId];
    }
  });
};

// Helper function to check the game result
function checkGameResult(board, userId) {
  const winPatterns = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  for (const pattern of winPatterns) {
    if (pattern.every(([x, y]) => board[x][y] === userId)) {
      return { winner: userId };
    }
  }

  if (board.every((row) => row.every((cell) => cell !== null))) {
    return { draw: true };
  }

  return null;
}

// Helper function to update player stats in the database
async function updatePlayerStats(player1Id, player2Id, result) {
  try {
    const player1 = await User.findOne({ where: { id: player1Id } });
    const player2 = await User.findOne({ where: { id: player2Id } });

    if (!player1 || !player2) return;

    if (result === 'win') {
      player1.wins += 1;
      player2.losses += 1;
    } else if (result === 'draw') {
      player1.draws += 1;
      player2.draws += 1;
    }

    // Save both players' updated stats to the database
    await Promise.all([player1.save(), player2.save()]);
  } catch (error) {
    console.error('Error updating player stats:', error);
  }
}
