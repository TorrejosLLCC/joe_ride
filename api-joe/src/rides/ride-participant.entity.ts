import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { RideOffer } from './ride-offer.entity';
import { User } from '../users/user.entity';

@Entity()
export class RideParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RideOffer, (r) => r.participants)
  rideOffer: RideOffer;

  @ManyToOne(() => User, { eager: true })
  passenger: User;

  @Column({ default: false })
  completed: boolean;
}
