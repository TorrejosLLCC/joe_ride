import { Module } from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { RideRequestController } from './ride-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideRequest } from './entities/ride-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RideRequest])],
  providers: [RideRequestService],
  controllers: [RideRequestController],
  exports: [RideRequestService],
})
export class RideRequestModule {}
