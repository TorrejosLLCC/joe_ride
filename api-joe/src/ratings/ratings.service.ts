import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class RatingsService {
  constructor(@InjectRepository(Rating) private repo: Repository<Rating>, private usersService: UsersService) { }

  async rate(raterId: number, dto: { rateeId: number; score: number; comment?: string }) {
    const rater = await this.usersService.findOneById(raterId);
    const ratee = await this.usersService.findOneById(dto.rateeId);
    if (!rater || !ratee) throw new NotFoundException('User not found');
    const rating = this.repo.create({ rater, ratee, score: dto.score, comment: dto.comment });
    return this.repo.save(rating);
  }

  async aggregate(rateeId: number) {
    const ratings = await this.repo.find({ where: { ratee: { id: rateeId } as any } });
    if (ratings.length === 0) return { count: 0, average: 0 };
    const sum = ratings.reduce((a, r) => a + r.score, 0);
    return { count: ratings.length, average: sum / ratings.length };
  }
}
