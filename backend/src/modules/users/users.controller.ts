import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './transformers/user.response.transformer';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Public()
  @Post('add-user')
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.addUser(createUserDto);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  getUserById(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService
      .getUserById(+id)
      .then((user) => new UserResponse(user));
  }
}
