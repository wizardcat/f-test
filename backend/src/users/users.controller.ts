import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  async addUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
  ) {
    return await this.usersService.addUser(name, email, phone);
  }

  @Get('get-user/:id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }
}
