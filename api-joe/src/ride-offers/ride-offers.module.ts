import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideOffer } from './entities/ride-offer.entity';
import { RideOffersController } from './ride-offers.controller';
import { RideOffersService } from './ride-offers.service';

@Module({
    imports: [TypeOrmModule.forFeature([RideOffer])],
    controllers: [RideOffersController],
    providers: [RideOffersService],
    exports: [RideOffersService],
})
export class RideOffersModule { }
