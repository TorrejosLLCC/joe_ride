import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) { }

  @Post()
  rate(@Request() req, @Body() body: any) { return this.ratingsService.rate(req.user.userId, body); }

  @Get(':id/aggregate')
  agg(@Param('id') id: string) { return this.ratingsService.aggregate(Number(id)); }
}
