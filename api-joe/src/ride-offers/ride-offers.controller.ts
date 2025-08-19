import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { RideOffersService } from './ride-offers.service';
import { CreateRideOfferDto } from './dto/create-ride-offer.dto';
// import { UpdateRideOfferDto } from './dto/update-ride-offer.dto';
// import { Request } from 'express';
import { Request } from '@nestjs/common';

@Controller('ride-offers')
export class RideOffersController {
    constructor(private readonly service: RideOffersService) { }

    // Create Ride Offer
    @Post()
    async create(@Req() req: Request, @Body() dto: CreateRideOfferDto) {
        // No JWT: take driver id from header. Fallback to dto.driverId for local testing.
        const driverId = (req.headers['x-user-id'] as string) || dto.driverId;
        if (!driverId) {
            return { error: 'Missing driver id (provide x-user-id header for now)' };
        }
        const created = await this.service.create(driverId, dto);
        return { message: 'Ride offer created', offer: created };
    }

    // Public Ride Board
    @Get()
    async findAll() {
        return this.service.findAll();
    }

    // Get one
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    // // Update (driver edits)
    // @Patch(':id')
    // async update(@Param('id') id: string, @Body() dto: UpdateRideOfferDto) {
    //     return this.service.update(id, dto);
    // }

    // Close posting
    @Patch(':id/close')
    async close(@Param('id') id: string) {
        return this.service.close(id);
    }

    // Delete posting
    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        await this.service.remove(id);
    }
}
