import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() body: { id: string; firstname: string }) {
    return this.userService.createUser(body.id, body.firstname);
  }

  @Post('update')
  async updatePoints(@Body() body: { id: string; points: number }) {
    return this.userService.updatePoints(body.id, body.points);
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.userService.getLeaderboard();
  }

  @Get('leaderboard/:id')
  async getUserRank(@Param('id') id: string) {
    return this.userService.getUserRank(id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { firstname: user.firstname, points: user.points };
  }
}
