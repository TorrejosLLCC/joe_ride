import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RideOffer } from './ride-offer.entity';
import { RideRequest } from './ride-request.entity';
import { RideParticipant } from './ride-participant.entity';
import { UsersService } from '../users/users.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';

interface OfferDto { origin: string; destination: string; departureTime: string; seats: number; vehicleId?: number; }
interface RequestDto { origin: string; destination: string; earliestDeparture: string; }

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(RideOffer) private offerRepo: Repository<RideOffer>,
    @InjectRepository(RideRequest) private requestRepo: Repository<RideRequest>,
    @InjectRepository(RideParticipant) private participantRepo: Repository<RideParticipant>,
    private usersService: UsersService,
    private vehiclesService: VehiclesService,
  ) { }

  async createOffer(userId: number, dto: OfferDto) {
    const driver = await this.usersService.findOneById(userId);
    if (!driver) throw new NotFoundException('Driver not found');
    if (!driver.driversLicenseNumber) throw new BadRequestException('Driver license required');
    let vehicle: any = undefined;
    if (dto.vehicleId) {
      vehicle = await this.vehiclesService.findOne(dto.vehicleId) || undefined;
    }
    const offer = this.offerRepo.create({
      driver,
      vehicle,
      origin: dto.origin,
      destination: dto.destination,
      departureTime: new Date(dto.departureTime),
      availableSeats: dto.seats,
      open: true,
    });
    return this.offerRepo.save(offer);
  }

  async createRequest(userId: number, dto: RequestDto) {
    const requester = await this.usersService.findOneById(userId);
    if (!requester) throw new NotFoundException('User not found');
    const req = this.requestRepo.create({
      requester,
      origin: dto.origin,
      destination: dto.destination,
      earliestDeparture: new Date(dto.earliestDeparture),
    });
    return this.requestRepo.save(req);
  }

  async board(filter?: { origin?: string; destination?: string }) {
    const offers = await this.offerRepo.find();
    const requests = await this.requestRepo.find();
    return [
      ...offers.filter(o => (!filter?.origin || o.origin === filter.origin) && (!filter?.destination || o.destination === filter.destination)).map(o => ({ type: 'offer', ...o })),
      ...requests.filter(r => (!filter?.origin || r.origin === filter.origin) && (!filter?.destination || r.destination === filter.destination)).map(r => ({ type: 'request', ...r })),
    ];
  }

  async joinOffer(userId: number, offerId: number) {
    const offer = await this.offerRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');
    if (!offer.open) throw new BadRequestException('Offer closed');
    if (offer.availableSeats <= 0) throw new BadRequestException('No seats');
    const passenger = await this.usersService.findOneById(userId);
    if (!passenger) throw new NotFoundException('Passenger not found');
    const participant = this.participantRepo.create({ rideOffer: offer, passenger });
    await this.participantRepo.save(participant);
    offer.availableSeats -= 1;
    if (offer.availableSeats === 0) offer.open = false;
    await this.offerRepo.save(offer);
    return participant;
  }
}
