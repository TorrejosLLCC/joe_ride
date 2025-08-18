// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsDateString, isString, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: Date;

    @IsNotEmpty()
    homeAddress: string;

    @IsOptional()
    vehicleType?: string;

    @IsOptional()
    vehiclePlate?: string;

    @IsOptional()
    driversLicenseNumber?: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    mobilePhoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}