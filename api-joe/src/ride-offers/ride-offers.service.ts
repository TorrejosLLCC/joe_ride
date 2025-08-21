import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RideOffer, RideOfferStatus } from './entities/ride-offer.entity';
import { CreateRideOfferDto } from './dto/create-ride-offer.dto';
// import { UpdateRideOfferDto } from './dto/update-ride-offer.dto';

@Injectable()
export class RideOffersService {
    constructor(
        @InjectRepository(RideOffer)
        private readonly repo: Repository<RideOffer>,
    ) { }

    async create(driverId: string, dto: CreateRideOfferDto) {
        const offer = this.repo.create({
            driverId,
            fromLocation: dto.fromLocation,
            toLocation: dto.toLocation,
            departureTime: new Date(dto.departure),
            capacity: dto.capacity,
            seatsAvailable: dto.capacity, // initialize
            pricePerSeat: dto.pricePerSeat ?? null,
            voucherRequired: dto.voucherRequired,
            vehicleType: dto.vehicleType,
            distanceKm: dto.distanceKm,
            status: RideOfferStatus.OPEN,
        });
        return this.repo.save(offer);
    }

    async findAll() {
        // Public Ride Board = OPEN only, newest first
        return this.repo.find({
            where: { status: RideOfferStatus.OPEN },
            order: { createdAt: 'DESC' },
            relations: ['driver'],
        });
    }

    async findOne(id: string) {
        const offer = await this.repo.findOne({ where: { id } });
        if (!offer) throw new NotFoundException('Ride offer not found');
        return offer;
    }

    // async update(id: string, changes: UpdateRideOfferDto) {
    //     const offer = await this.findOne(id);
    //     Object.assign(offer, {
    //         ...changes,
    //         departureTime: changes.departureTime ? new Date(changes.departureTime) : offer.departureTime,
    //         pricePerSeat: changes.pricePerSeat ?? offer.pricePerSeat,
    //     });
    //     // keep seatsAvailable within [0, capacity]
    //     if (changes.capacity && offer.seatsAvailable > changes.capacity) {
    //         offer.seatsAvailable = changes.capacity;
    //     }
    //     return this.repo.save(offer);
    // }

    async close(id: string) {
        const offer = await this.findOne(id);
        offer.status = RideOfferStatus.CLOSED;
        return this.repo.save(offer);
    }

    async remove(id: string) {
        const offer = await this.findOne(id);
        await this.repo.remove(offer);
        return { deleted: true };
    }
}
