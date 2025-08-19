import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { RideOffer } from './rides/ride-offer.entity';
import { RideRequest } from './rides/ride-request.entity';
import { RideParticipant } from './rides/ride-participant.entity';
import { Vehicle } from './vehicles/vehicle.entity';
import { VoucherTransaction } from './vouchers/voucher-transaction.entity';
import { Rating } from './ratings/rating.entity';
import { RidesService } from './rides/rides.service';
import { RidesController } from './rides/rides.controller';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehiclesController } from './vehicles/vehicles.controller';
import { VoucherService } from './vouchers/voucher.service';
import { RatingsService } from './ratings/ratings.service';
import { RatingsController } from './ratings/ratings.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: 5432,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, RideOffer, RideRequest, RideParticipant, Vehicle, VoucherTransaction, Rating],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // Register repositories for injected services (fix for UnknownDependenciesException)
    TypeOrmModule.forFeature([RideOffer, RideRequest, RideParticipant, Vehicle, Rating]),

    AuthModule,
    UsersModule
  ],
  controllers: [AppController, RidesController, VehiclesController, RatingsController],
  providers: [AppService, RidesService, VehiclesService, VoucherService, RatingsService],
})
export class AppModule { }