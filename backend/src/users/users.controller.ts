import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  async addUser(@Body() userDto: UserDto) {
    return await this.usersService.addUser(userDto);
  }

  // @Get('get-user/:id')
  // async getUser(@Param('id') id: number) {
  //   return await this.usersService.getUserById(id);
  // }

  @Get('get-user')
  async getUser() {
    return await this.usersService.getUserById(1);
  }

  @Get('profile')
  @Auth()
  async getUserProfile(@CurrentUser('id') id: number) {
    return await this.usersService.getUserById(id);
  }
}
