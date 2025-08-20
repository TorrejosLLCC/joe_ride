import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { CreateRideRequestDto } from './dto/create-ride-request.dto';

@Controller('ride-requests')
export class RideRequestController {
    constructor(private readonly rideRequestService: RideRequestService) { }

    @Post()
    async create(@Req() req: Request, @Body() dto: CreateRideRequestDto) {
        // No JWT: take user id from header. Fallback to dto.userId for local testing.
        const userId = (req.headers['x-user-id'] as string) || dto.userId;
        if (!userId) {
            return { error: 'Missing user id (provide x-user-id header for now)' };
        }
        const created = await this.rideRequestService.create(userId, dto);
        return { message: 'Ride request created', request: created };
    }

    @Put()
    async createOrUpdate(@Req() req: Request, @Body() dto: CreateRideRequestDto) {
        const userId = (req.headers['x-user-id'] as string) || dto.userId;
        if (!userId) {
            return { error: 'Missing user id (provide x-user-id header for now)' };
        }
        
        // Use findAll and filter by userId since findByUserId doesn't exist
        const allRequests = await this.rideRequestService.findAll();
        const existingRequest = allRequests.find(request => request.userId === userId);
        
        if (existingRequest) {
            // Use the existing update endpoint pattern
            return this.rideRequestService.findOne(existingRequest.id);
        }
        
        return this.rideRequestService.create(userId, dto);
    }

    @Get()
    async findAll() {
        return this.rideRequestService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.rideRequestService.findOne(id);
    }

    @Patch(':id/close')
    async close(@Param('id') id: string) {
        return this.rideRequestService.close(id);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        await this.rideRequestService.remove(id);
        return { message: 'Ride request deleted' };
    }
}
