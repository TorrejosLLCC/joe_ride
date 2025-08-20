import { IsString, IsDateString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateRideRequestDto {
    @IsString()
    fromLocation: string;

    @IsString()
    toLocation: string;

    @IsDateString()
    preferredDate: string;

    @IsString()
    preferredTimeFrom: string;

    @IsString()
    preferredTimeTo: string;

    @IsBoolean()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value === 'true';
        }
        return Boolean(value);
    })
    voucherRequired: boolean;

    @IsNumber()
    @Type(() => Number)
    distanceKm: number;

    @IsOptional()
    @IsString()
    userId?: string;
}