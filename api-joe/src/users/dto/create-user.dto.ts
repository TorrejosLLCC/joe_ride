// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsDateString, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
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
    @IsPhoneNumber('PH')
    mobilePhoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}