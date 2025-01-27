const { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } = require('typeorm');
const User = require('./User');

@Entity('game_rooms')
class GameRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255 })
  roomName;

  @Column({ type: 'boolean' })
  isPrivate;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  joinCode;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  createdBy;
}

module.exports = GameRoom;
