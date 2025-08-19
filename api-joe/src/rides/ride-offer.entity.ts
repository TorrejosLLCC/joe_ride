import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
// Use function string name to avoid direct TS type requirement for RideParticipant (defined later)
import { RideParticipant } from './ride-participant.entity.js';

@Entity()
export class RideOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  driver: User;

  @ManyToOne(() => Vehicle, { eager: true, nullable: true })
  vehicle?: Vehicle;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column()
  availableSeats: number;

  @Column({ default: true })
  open: boolean;

  @OneToMany(() => RideParticipant, (p: RideParticipant) => p.rideOffer, { cascade: true })
  participants: RideParticipant[];
}
