import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('rides')
export class RidesController {
  constructor(private ridesService: RidesService) { }

  @Post('offer')
  createOffer(@Request() req, @Body() body: any) {
    return this.ridesService.createOffer(req.user.userId, body);
  }

  @Post('request')
  createRequest(@Request() req, @Body() body: any) {
    return this.ridesService.createRequest(req.user.userId, body);
  }

  @Get('board')
  board(@Query('origin') origin?: string, @Query('destination') destination?: string) {
    return this.ridesService.board({ origin, destination });
  }

  @Post('offers/:id/join')
  join(@Request() req, @Param('id') id: string) {
    return this.ridesService.joinOffer(req.user.userId, Number(id));
  }
}
