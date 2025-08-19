import { Controller, Post, Body, UseGuards, Request, Get, Param, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) { }

  @Post()
  create(@Request() req, @Body() body: any) { return this.vehiclesService.create(req.user.userId, body); }
  @Get()
  all() { return this.vehiclesService.findAll(); }
  @Delete(':id')
  del(@Param('id') id: string) { return this.vehiclesService.remove(Number(id)); }
}
