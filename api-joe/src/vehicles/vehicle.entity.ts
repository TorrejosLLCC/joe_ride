import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ unique: true })
  plate: string;

  @Column()
  capacity: number;

  @ManyToOne(() => User, { eager: true })
  owner: User;
}
