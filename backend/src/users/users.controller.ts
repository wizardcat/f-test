import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  async addUser(@Body() userDto: UserDto) {
    return await this.usersService.addUser(userDto);
  }

  @Get('get-user/:id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }
}
