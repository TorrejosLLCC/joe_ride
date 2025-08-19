import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private repo: Repository<Vehicle>, private usersService: UsersService) { }

  async create(ownerId: number, dto: { make: string; model: string; plate: string; capacity: number; }) {
    const owner = await this.usersService.findOneById(ownerId);
    if (!owner) throw new NotFoundException('Owner not found');
    const vehicle = this.repo.create({ ...dto, owner });
    return this.repo.save(vehicle);
  }

  async findAll() { return this.repo.find(); }
  async findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  async remove(id: number) { await this.repo.delete(id); }
}
