import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RideOffersModule } from './ride-offers/ride-offers.module';
import { RideOffer } from './ride-offers/entities/ride-offer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        // port: parseInt(configService.get('DB_PORT'), 10),
        port: 5432,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, RideOffer],
        synchronize: true,
        autoLoadEntities: true, // useful if you don’t want to list entities manually
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RideOffersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
