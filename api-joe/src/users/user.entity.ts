// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsDate } from 'class-validator';
import { RideOffer } from 'src/ride-offers/entities/ride-offer.entity';
import { RideRequest } from 'src/ride-request/entities/ride-request.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    fullName: string;

    @Column()
    @IsNotEmpty()
    @IsDate()
    dateOfBirth: Date;

    @Column()
    @IsNotEmpty()
    homeAddress: string;

    @Column({ nullable: true })
    @IsOptional()
    vehicleType?: string;

    @Column({ nullable: true })
    @IsOptional()
    vehiclePlate?: string;

    @Column({ nullable: true })
    @IsOptional()
    driversLicenseNumber?: string;

    @Column()
    @IsNotEmpty()
    @IsPhoneNumber()
    mobilePhoneNumber: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 1 user can have many ride offers
    @OneToMany(() => RideOffer, rideOffer => rideOffer.driver)
    rideOffers: RideOffer[];

    @OneToMany(() => RideRequest, (rideRequest) => rideRequest.user)
    rideRequests: RideRequest[];



    // 1 user can have one ride request
    @OneToOne(() => RideRequest, rideRequest => rideRequest.user)
    rideRequest: RideRequest;

}