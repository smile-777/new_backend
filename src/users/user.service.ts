import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(id: string, firstname: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      user = this.userRepository.create({ id, firstname });
      await this.userRepository.save(user);
    }
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updatePoints(id: string, points: number): Promise<User | null> {
    const user = await this.getUser(id);
    if (user) {
      user.points += points;
      await this.userRepository.save(user);
      return user;
    }
    return null;
  }

  async getLeaderboard(): Promise<User[]> {
    return this.userRepository.find({ order: { points: 'DESC' }, take: 10 });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserRank(
    id: string,
  ): Promise<{ firstname: string; points: number; rank: number } | null> {
    const leaderboard = await this.getLeaderboard();
    const index = leaderboard.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    const user = leaderboard[index];
    return {
      firstname: user.firstname,
      points: user.points,
      rank: index + 1,
    };
  }
}
