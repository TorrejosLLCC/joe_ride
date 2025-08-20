import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/user.entity";

export enum RideRequestStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    CANCELLED = 'cancelled',
}

@Entity('ride_requests')
export class RideRequest {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.rideRequest, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ length: 255 })
    fromLocation: string;

    @Column({ length: 255 })
    toLocation: string;

    @Column({ type: 'date' })
    preferredDate: string; // e.g. "2023-10-01"

    @Column({ type: 'time' })
    preferredTimeFrom: string; // e.g. "15:30"

    @Column({ type: 'time' }) 
    preferredTimeTo: string; // e.g. "15:30"

    @Column({ type: 'boolean', default: false })
    voucherRequired: boolean;

    @Column({ type: 'float' })
    distanceKm: number;

    @Column({ type: 'enum', enum: RideRequestStatus, default: RideRequestStatus.OPEN })
    status: RideRequestStatus;

    @CreateDateColumn()
    createdAt: Date;
}