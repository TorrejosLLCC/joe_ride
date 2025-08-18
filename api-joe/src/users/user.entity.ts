// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsDate } from 'class-validator';

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
}