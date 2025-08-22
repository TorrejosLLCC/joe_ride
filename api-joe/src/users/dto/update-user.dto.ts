// src/users/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    homeAddress?: string;

    @IsOptional()
    @IsString()
    vehicleType?: string;

    @IsOptional()
    @IsString()
    vehiclePlate?: string;

    @IsOptional()
    @IsString()
    driversLicenseNumber?: string;

    @IsOptional()
    @IsPhoneNumber()
    mobilePhoneNumber?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
}
