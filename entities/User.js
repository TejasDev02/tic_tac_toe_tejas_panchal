const { Entity, PrimaryGeneratedColumn, Column, BaseEntity } = require('typeorm');

@Entity('users')
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255, unique: true })
  username;

  @Column({ type: 'varchar', length: 255 })
  password;

  @Column({ type: 'int', default: 0 })
  wins;

  @Column({ type: 'int', default: 0 })
  losses;

  @Column({ type: 'int', default: 0 })
  draws;
}

module.exports = User;
