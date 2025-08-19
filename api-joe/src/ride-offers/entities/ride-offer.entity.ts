import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/user.entity';

export enum VehicleType {
    MOTORCYCLE = 'motorcycle',
    SEDAN = 'sedan',
    SUV = 'suv',
    PICKUP = 'pickup',
    VAN = 'van',
    OTHER = 'other',
}

export enum RideOfferStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    CANCELLED = 'cancelled',
}

@Entity('ride_offers')
export class RideOffer {
    @PrimaryGeneratedColumn()
    id: string;

    // @Column('uuid')
    @Column()
    driverId: string;

    @ManyToOne(() => User, { nullable: true })
    driver?: User;

    @Column({ length: 255 })
    fromLocation: string;

    @Column({ length: 255 })
    toLocation: string;

    // @Column({ type: 'datetime' })
    // departureTime: Date;

    // Fix issue
    @Column({ type: 'timestamp' })
    departureTime: Date;

    // capacity 1–8 (validated in DTO)
    @Column({ type: 'int' })
    capacity: number;

    // seats available (initialize to capacity on create)
    @Column({ type: 'int' })
    seatsAvailable: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    pricePerSeat: number | null;

    @Column({ type: 'boolean', default: false })
    voucherRequired: number;

    @Column({ type: 'enum', enum: VehicleType, default: VehicleType.OTHER })
    vehicleType: VehicleType;

    // MVP: driver inputs distance
    @Column({ type: 'float' })
    distanceKm: number;

    @Column({ type: 'enum', enum: RideOfferStatus, default: RideOfferStatus.OPEN })
    status: RideOfferStatus;

    @CreateDateColumn()
    createdAt: Date;
}
