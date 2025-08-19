import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min } from 'class-validator';
import { VehicleType } from '../entities/ride-offer.entity';

export class CreateRideOfferDto {
    // Driver is taken from header x-user-id; this is here only for testing fallback
    @IsOptional()
    @IsString()
    driverId?: string;

    @IsString()
    @Length(2, 255)
    fromLocation: string;

    @IsString()
    @Length(2, 255)
    toLocation: string;

    @IsDateString()
    departureTime: string; // ISO date string

    @IsInt()
    @Min(1)
    @Max(8)
    capacity: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    pricePerSeat?: number;

    @IsInt()
    @Min(0)
    voucherRequired: number;

    @IsEnum(VehicleType)
    vehicleType: VehicleType;

    @IsNumber()
    @IsPositive()
    distanceKm: number;
}
