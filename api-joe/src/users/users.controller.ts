import { Controller, Get, Param, Put, Delete, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

function sanitize(user: User) {
  if (!user) return user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(Number(id));
    if (!user) throw new NotFoundException('User not found');
    return sanitize(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    const user = await this.usersService.update(Number(id), body);
    if (!user) throw new NotFoundException('User not found');
    return sanitize(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
    return { success: true };
  }
}
