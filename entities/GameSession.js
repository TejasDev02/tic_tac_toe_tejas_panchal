const { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } = require('typeorm');
const GameRoom = require('./GameRoom');
const User = require('./User');

@Entity('game_sessions')
class GameSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id;

  @ManyToOne(() => GameRoom, (room) => room.id, { onDelete: 'CASCADE' })
  gameRoom;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  player1;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  player2;

  @Column({ type: 'simple-json' })
  boardState; // 3x3 matrix stored as JSON

  @Column({ type: 'int' })
  currentTurn; // Stores the player ID whose turn it is

  @Column({ type: 'int', nullable: true })
  winner; // Stores the winner's ID (nullable if draw)
}

module.exports = GameSession;
