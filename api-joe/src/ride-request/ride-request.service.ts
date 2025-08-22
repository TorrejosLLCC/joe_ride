import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RideRequest, RideRequestStatus } from './entities/ride-request.entity';
import { Repository } from 'typeorm';
import { CreateRideRequestDto } from './dto/create-ride-request.dto';

@Injectable()
export class RideRequestService {
    constructor(
        @InjectRepository(RideRequest)
        private readonly repo: Repository<RideRequest>,
    ) { }

    async create(userId: string, dto: CreateRideRequestDto) {
        const request = this.repo.create({
            userId,
            fromLocation: dto.fromLocation,
            toLocation: dto.toLocation,
            preferredDate: dto.preferredDate,
            preferredTimeFrom: dto.preferredTimeFrom,
            preferredTimeTo: dto.preferredTimeTo,
            voucherRequired: Boolean(dto.voucherRequired), // Convert to boolean
            distanceKm: Number(dto.distanceKm), // Ensure it's a number
        });
        return this.repo.save(request);
    }

    async findAll() {
        return this.repo.find({
            order: { createdAt: 'DESC' }, // Newest first
            relations: ['user'],
        });
    }

    async findOne(id: string) {
        const request = await this.repo.findOne({ where: { id } });
        if (!request) throw new NotFoundException('Ride request not found');
        return request;
    }

    async close(id: string) {
        const request = await this.findOne(id);
        request.status = RideRequestStatus.CLOSED;
        return this.repo.save(request);
    }

    async remove(id: string) {
        const request = await this.findOne(id);
        await this.repo.remove(request);
        return { deleted: true };
    }
}
